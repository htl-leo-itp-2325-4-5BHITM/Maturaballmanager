import SwiftUI
import Combine

class SOSViewModel: ObservableObject {
    @Published var storedTickets: [TicketDTO] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: IdentifiableErrorMessage?
    @Published var successMessage: IdentifiableErrorMessage?
    private var cancellable: AnyCancellable?
    private var networkMonitor: NetworkMonitor

    init() {
        self.networkMonitor = NetworkMonitor()
        loadStoredTickets()
        observeInternetConnection()
        
    }

    private func observeInternetConnection() {
        cancellable = networkMonitor.$isConnected
            .sink { [weak self] isConnected in
                if isConnected {
                    self?.syncTicketsWithServer()
                }
            }
    }

    private func syncTicketsWithServer() {
        guard !storedTickets.isEmpty else { return }
        let ticketIds = storedTickets.map { $0.id }
        ApiService.shared.redeemAllTickets(ticketIds: ticketIds) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.storedTickets.removeAll()
                    UserDefaults.standard.removeObject(forKey: "storedTickets")
                    self.successMessage = IdentifiableErrorMessage(message: "Alle Tickets erfolgreich entwertet.")
                case .failure:
                    self.errorMessage = IdentifiableErrorMessage(message: "Fehler beim Synchronisieren mit dem Server.")
                }
            }
        }
    }

    @objc private func didUpdateStoredTickets() {
        loadStoredTickets()
    }

    func loadStoredTickets() {
        isLoading = true
        DispatchQueue.global(qos: .background).async {
            if let storedData = UserDefaults.standard.array(forKey: "storedTickets") as? [Data] {
                let decodedTickets = storedData.compactMap { try? JSONDecoder().decode(TicketDTO.self, from: $0) }
                DispatchQueue.main.async {
                    self.storedTickets = Array(Set(decodedTickets))
                    self.isLoading = false
                }
            } else {
                DispatchQueue.main.async {
                    self.isLoading = false
                }
            }
        }
    }
}
