import SwiftUI
import AVFoundation

struct ScannerView: View {
    @StateObject private var viewModel = QRCodeScannerViewModel()

    var body: some View {
        VStack {
            Text("Tickets überprüfen")
                .font(.largeTitle)
                .fontWeight(.bold)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
                .padding(.top, 25)
            
            ZStack {
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Color.gray, lineWidth: 6)
                    .frame(width: 250, height: 250)
                  s  .overlay(
                        CameraPreview(session: viewModel.captureSession)
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                    )
            }
            .padding(.bottom, 20)
            
            if viewModel.isSignatureValid {
                    validSignatureView
                } else {
                    invalidSignatureView
                }
            } else {
                Text("Scanning...")
                    .font(.title2)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(8)
                    .frame(maxWidth: .infinity)
            }
            
            Spacer()
        }
        .onAppear {
            viewModel.startScanning()
        }
        .onDisappear {
            viewModel.stopScanning()
        }
    }
    
    private var validSignatureView: some View {
        Group {
            Image(systemName: "checkmark.circle.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 50, height: 50)
                .foregroundColor(.green)
            
            if let customer = viewModel.ticketSummary?.customer {
                VStack {
                    Text("VIP Status: \(customer.isVip ? "Ja" : "Nein")")
                        .font(.title2)
                        .padding()
                        .background(Color.white)
                        .cornerRadius(8)
                        .frame(maxWidth: .infinity)

                    Text("Name: \(customer.firstName) \(customer.lastName)")
                        .font(.title2)
                        .padding()
                        .background(Color.white)
                        .cornerRadius(8)
                        .frame(maxWidth: .infinity)
                }
            }
        }
    }
    
    private var invalidSignatureView: some View {
        Group {
            Image(systemName: "xmark.circle.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 50, height: 50)
                .foregroundColor(.red)
            Text("Ungültige Signatur")
                .font(.title2)
                .padding()
                .background(Color.white)
                .cornerRadius(8)
                .frame(maxWidth: .infinity)
        }
    }
}
