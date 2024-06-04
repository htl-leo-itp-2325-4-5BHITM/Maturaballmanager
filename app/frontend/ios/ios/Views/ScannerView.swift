import SwiftUI

struct ScannerView: View {
    @State private var scannedCode: String?
    @State private var ticketDTO: TicketDTO?
    @State private var showPopup = false
    @State private var errorMessage: String?
    @State private var navigationLinkActive = false
    @State private var dataInvalid = false
    @State private var isScanningActive = true

    var body: some View {
        ZStack {
            if isScanningActive {
                QRCodeScannerView {
                    self.scannedCode = $0
                    self.processScannedCode($0)
                }
                .edgesIgnoringSafeArea(.all)
                .navigationBarTitle("")
                .navigationBarHidden(true)
            }
            
            NavigationLink(destination: TicketInfoView(ticketDTO: ticketDTO, dataInvalid: $dataInvalid)
                            .onDisappear {
                                self.isScanningActive = true
                            }, isActive: $navigationLinkActive) {
                EmptyView()
            }
        }
        .alert(isPresented: .constant(errorMessage != nil), content: {
            Alert(title: Text("Error"), message: Text(errorMessage ?? "Unknown error"), dismissButton: .default(Text("OK")))
        })
    }

    private func processScannedCode(_ code: String) {
        guard let data = code.data(using: .utf8) else {
            errorMessage = "Invalid QR code data"
            return
        }

        do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601 // Konfiguration der Datumsdekodierung
            let ticketDTO = try decoder.decode(TicketDTO.self, from: data)
            self.ticketDTO = ticketDTO
            self.errorMessage = nil
            self.dataInvalid = false
            self.isScanningActive = false
            self.navigationLinkActive = true
        } catch {
            self.errorMessage = nil
            self.ticketDTO = nil
            self.dataInvalid = true
            self.isScanningActive = false
            self.navigationLinkActive = true
        }
    }
}

struct ScannerView_Previews: PreviewProvider {
    static var previews: some View {
        ScannerView()
    }
}
