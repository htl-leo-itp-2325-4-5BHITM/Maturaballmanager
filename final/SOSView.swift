import SwiftUI

struct SOSView: View {
    @State private var storedTickets: [TicketDTO] = []
    @ObservedObject var sosCounter: SOSCounter

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
    }

    private func loadStoredTickets() {
        if let storedData = UserDefaults.standard.array(forKey: "storedTickets") as? [Data] {
            let decodedTickets = storedData.compactMap { try? JSONDecoder().decode(TicketDTO.self, from: $0) }
            self.storedTickets = Array(Set(decodedTickets))
            self.sosCounter.count = self.storedTickets.count
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
                        self.sosCounter.count = self.storedTickets.count
                    }
                case .failure:
                    print("")
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
                    self.sosCounter.count = 0
                case .failure:
                    print("")
                }
            }
        }
    }
}
