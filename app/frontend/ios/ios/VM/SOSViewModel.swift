import SwiftUI
import Combine
import Network

class SOSViewModel: ObservableObject {
    @Published var storedTickets: [TicketDTO] = []
    private var cancellable: AnyCancellable?
    private var networkMonitor: NetworkMonitor

    init() {
        self.networkMonitor = NetworkMonitor()
        checkInternetConnection()
        loadStoredTickets()
    }

    private func checkInternetConnection() {
        cancellable = networkMonitor.$isConnected
            .sink { [weak self] isConnected in
                if isConnected {
                    self?.syncTicketsWithServer()
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

    func redeemStoredTicket(ticket: TicketDTO) {
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

    func redeemAllTickets() {
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
