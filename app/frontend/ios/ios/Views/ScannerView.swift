import SwiftUI

struct ScannerView: View {
    @State private var scannedCode: String?
    @State private var ticketDTO: TicketDTO?
    @State private var showPopup = false
    @State private var errorMessage: String?
    @State private var navigationLinkActive = false
    @State private var dataInvalid = false
    @State private var isScanningActive = true 
    @State private var noInternet = false
    @ObservedObject var sosCounter: SOSCounter

    var body: some View {
        ZStack {
            QRCodeScannerView(didFindCode: { code in
                self.scannedCode = code
                self.processScannedCode(code)
            }, isScanning: $isScanningActive)
            .edgesIgnoringSafeArea(.all)
            .navigationBarTitle("")
            .navigationBarHidden(true)

            NavigationLink(destination: TicketInfoView(ticketDTO: ticketDTO, dataInvalid: $dataInvalid)
                            .onAppear {
                                self.isScanningActive = false                             }
                            .onDisappear {
                                self.isScanningActive = true
                            }, isActive: $navigationLinkActive) {
                EmptyView()
            }
        }
        .alert(isPresented: .constant(errorMessage != nil || noInternet), content: {
            Alert(title: Text("Fehlermeldung"), message: Text(errorMessage ?? "Keine Internetverbindung - SOS"), dismissButton: .default(Text("OK")))
        })
    }

    private func processScannedCode(_ code: String) {
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
                            self.sosCounter.loadSOSCount()
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
