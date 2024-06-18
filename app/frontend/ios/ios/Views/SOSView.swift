import SwiftUI
import Combine

struct SOSView: View {
    @State private var storedTickets: [TicketDTO] = []
    @State private var cancellable: AnyCancellable?
    @ObservedObject private var networkMonitor = NetworkMonitor()

    var body: some View {
        NavigationView {
            VStack {
                List {
                    ForEach(storedTickets, id: \.id) { ticket in
                        HStack {
                            VStack(alignment: .leading) {
                                Text("T.-Nr.: \(ticket.id)")
                                Text("Name: \(ticket.user.sex == "male" ? "Hr." : "Fr.") \(ticket.user.firstName) \(ticket.user.lastName)")
                                Text("VIP Status: \(ticket.user.vipStatus ? "Ja" : "Nein")")
                            }
                            Spacer()
                            if ticket.user.vipStatus {
                                Image(systemName: "crown.fill")
                                    .foregroundColor(.yellow)
                            }
                            Button(action: {
                                redeemStoredTicket(ticket: ticket)
                            }) {
                                Text("Entwerten")
                                    .foregroundColor(.red)
                            }
                        }
                    }
                }
                .navigationBarTitle("SOS Tickets")
                .onAppear(perform: loadStoredTickets)

                Button(action: redeemAllTickets) {
                    Text("Alle entwerten")
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.red)
                        .cornerRadius(10)
                }
                .padding()
            }
        }
        .onAppear {
            checkInternetConnection()
        }
        .onDisappear {
            cancellable?.cancel()
        }
    }

    private func checkInternetConnection() {
        cancellable = Timer.publish(every: 5.0, on: .main, in: .common)
            .autoconnect()
            .sink { _ in
                if self.networkMonitor.isConnected {
                    self.syncTicketsWithServer()
                }
            }
    }

    private func syncTicketsWithServer() {
        let ticketIds = storedTickets.map { $0.id }
        ApiService.shared.redeemAllTickets(ticketIds: ticketIds) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.storedTickets.removeAll()
                    UserDefaults.standard.removeObject(forKey: "storedTickets")
                case .failure:
                    print("Failed to sync with server")
                }
            }
        }
    }

    private func loadStoredTickets() {
        if let storedData = UserDefaults.standard.array(forKey: "storedTickets") as? [Data] {
            let decodedTickets = storedData.compactMap { try? JSONDecoder().decode(TicketDTO.self, from: $0) }
            self.storedTickets = Array(Set(decodedTickets))
        }
    }

    private func redeemStoredTicket(ticket: TicketDTO) {
        ApiService.shared.redeemTicket(ticketId: ticket.id) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    if let index = self.storedTickets.firstIndex(where: { $0.id == ticket.id }) {
                        self.storedTickets.remove(at: index)
                        let encodedTickets = self.storedTickets.compactMap { try? JSONEncoder().encode($0) }
                        UserDefaults.standard.set(encodedTickets, forKey: "storedTickets")
                    }
                case .failure:
                    print("Failed to redeem ticket")
                }
            }
        }
    }

    private func redeemAllTickets() {
        let ticketIds = storedTickets.map { $0.id }
        ApiService.shared.redeemAllTickets(ticketIds: ticketIds) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.storedTickets.removeAll()
                    UserDefaults.standard.removeObject(forKey: "storedTickets")
                case .failure:
                    print("Failed to redeem all tickets")
                }
            }
        }
    }
}
