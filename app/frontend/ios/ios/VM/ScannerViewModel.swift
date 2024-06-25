import SwiftUI
import Combine

class ScannerViewModel: ObservableObject {
    @Published var scannedCode: String?
    @Published var ticketDTO: TicketDTO?
    @Published var errorMessage: String?
    @Published var dataInvalid = false
    @Published var navigationLinkActive = false
    @Published var isScanningActive = true
    @Published var noInternet = false

    func processScannedCode(_ code: String) {
        guard let data = code.data(using: .utf8) else {
            errorMessage = "Invalid QR code data"
            return
        }

        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let decoder = JSONDecoder()
                decoder.dateDecodingStrategy = .iso8601
                var ticketDTO = try decoder.decode(TicketDTO.self, from: data)

                ApiService.shared.checkRedeemedStatus(ticketId: ticketDTO.id) { result in
                    DispatchQueue.main.async {
                        switch result {
                        case .success(let isRedeemed):
                            ticketDTO.isRedeemed = isRedeemed
                            self.ticketDTO = ticketDTO
                            self.errorMessage = nil
                            self.dataInvalid = false
                            self.navigationLinkActive = true
                        case .failure:
                            self.saveTicketLocally(ticketDTO: ticketDTO)
                            self.noInternet = true
                        }
                    }
                }
            } catch {
                DispatchQueue.main.async {
                    self.errorMessage = nil
                    self.ticketDTO = nil
                    self.dataInvalid = true
                    self.navigationLinkActive = true
                }
            }
        }
    }

    private func saveTicketLocally(ticketDTO: TicketDTO) {
        var storedTickets = UserDefaults.standard.array(forKey: "storedTickets") as? [Data] ?? []
        if let encoded = try? JSONEncoder().encode(ticketDTO) {
            storedTickets.append(encoded)
            UserDefaults.standard.set(storedTickets, forKey: "storedTickets")
        }
    }
}
