import SwiftUI

struct ScannerView: View {
    @StateObject private var viewModel: ScannerViewModel
    @EnvironmentObject var snackbarManager: SnackbarManager

    init() {
        _viewModel = StateObject(wrappedValue: ScannerViewModel())
    }

    var body: some View {
        NavigationView {
            ZStack {
                GeometryReader { geometry in
                    QRCodeScannerView(didFindCode: { code in
                        viewModel.processScannedCode(code)
                    }, isScanning: $viewModel.isScanningActive)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .edgesIgnoringSafeArea(.top)
                    .navigationBarTitle("")
                    .navigationBarHidden(true)
                    .onAppear {
                        viewModel.isScanningActive = true
                    }
                    .onDisappear {
                        viewModel.isScanningActive = false
                    }

                    NavigationLink(destination: TicketInfoView(viewModel: TicketInfoViewModel(ticketDTO: viewModel.ticketDTO))
                                    .onAppear {
                                        viewModel.isScanningActive = false
                                    }
                                    .onDisappear {
                                        viewModel.isScanningActive = true
                                    }, isActive: $viewModel.navigationLinkActive) {
                        EmptyView()
                    }
                }

                VStack {
                    Spacer()
                    SnackbarView()
                        .environmentObject(snackbarManager)
                }
            }
            .alert(isPresented: .constant(viewModel.errorMessage != nil || viewModel.noInternet), content: {
                Alert(title: Text("Fehlermeldung"), message: Text(viewModel.errorMessage ?? "Keine Internetverbindung - SOS"), dismissButton: .default(Text("OK")))
            })
        }
    }
}

struct ScannerView_Previews: PreviewProvider {
    static var previews: some View {
        ScannerView().environmentObject(SnackbarManager())
    }
}
