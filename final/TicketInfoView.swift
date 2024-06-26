import SwiftUI

struct TicketInfoView: View {
    var ticketDTO: TicketDTO?
    @Binding var dataInvalid: Bool
    @State private var verificationResult: Bool?
    @State private var showAlert = false
    @State private var alertMessage = ""
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: TicketViewModel

    var body: some View {
        VStack(spacing: 20) {
            if dataInvalid {
                WarningSymbol()
                Spacer()
            } else if let ticketDTO = ticketDTO {
                if ticketDTO.isRedeemed == true {
                    WarningSymbol()
                    Text("Dieses Ticket von \(ticketDTO.user.sex == "male" ? "Hr." : "Fr.") \(ticketDTO.user.firstName) \(ticketDTO.user.lastName) wurde bereits entwertet.")
                        .foregroundColor(.orange)
                        .font(.headline)
                        .multilineTextAlignment(.center)
                        .padding()
                    Spacer()
                } else {
                    VStack {
                        if ticketDTO.user.vipStatus {
                            Image(systemName: "crown.fill")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 100, height: 100)
                                .foregroundColor(.yellow)
                                .padding(.top, 20)
                        } else {
                            Image(systemName: "checkmark.circle.fill")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 100, height: 100)
                                .foregroundColor(.green)
                                .padding(.top, 20)
                        }

                        Text("Ticket ID: \(ticketDTO.id)")
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, 10)

                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Text("Name:")
                                    .font(.headline)
                                Spacer()
                                Text("\(ticketDTO.user.sex == "male" ? "Hr." : "Fr.") \(ticketDTO.user.firstName) \(ticketDTO.user.lastName)")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                            }
                            
                            HStack {
                                Text("Geschlecht:")
                                    .font(.headline)
                                Spacer()
                                Text("\(ticketDTO.user.sex == "male" ? "männlich" : "weiblich")")
                                    .font(.subheadline)
                            }
                            
                            HStack {
                                Text("VIP Status:")
                                    .font(.headline)
                                Spacer()
                                Text("\(ticketDTO.user.vipStatus ? "Ja" : "Nein")")
                                    .font(.subheadline)
                            }
                            
                            Text("Signatur:")
                                .font(.headline)
                            
                            ScrollView {
                                Text(ticketDTO.digitalSignature)
                                    .font(.footnote)
                                    .padding(.horizontal, 20)
                                    .padding(.top, 5)
                            }
                            .frame(height: 100)
                            
                            if let verificationResult = verificationResult {
                                Text(verificationResult ? "Signatur verifiziert" : "Signatur ungültig")
                                    .font(.headline)
                                    .foregroundColor(verificationResult ? .green : .red)
                            }
                        }
                        .padding(.horizontal, 20)
                        .background(RoundedRectangle(cornerRadius: 10).fill(Color(.systemGray6)))
                        .padding(.horizontal)
                        
                        Button(action: {
                            redeemTicket(ticketDTO: ticketDTO)
                        }) {
                            Text("Entwerten")
                                .font(.title2)
                                .padding()
                                .background(Color.red)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                        }
                        .alert(isPresented: $showAlert) {
                            Alert(title: Text("Ticketstatus"), message: Text(alertMessage), dismissButton: .default(Text("OK"), action: {
                                if alertMessage == "Das Ticket wurde erfolgreich entwertet." {
                                    self.presentationMode.wrappedValue.dismiss()
                                }
                            }))
                        }
                        
                        Spacer()
                    }
                }
            } else {
                Text("Keine Ticketinformationen")
                    .font(.title)
                    .padding(.top, 20)
            }
        }
        .padding()
        .navigationBarTitle("Ticketdetails", displayMode: .inline)
        .background(Color(.systemBackground).edgesIgnoringSafeArea(.all))
        .onAppear {
            if let ticketDTO = ticketDTO {
                verifySignature()
            }
        }
    }
    
    private func verifySignature() {
        guard let ticketDTO = ticketDTO else { return }
        
        let publicKey = PublicKeyLoader.loadPublicKey()
        let signedData = "Issuer: HTL Leonding"
        let signature = ticketDTO.digitalSignature
        
        if let publicKey = publicKey {
            verificationResult = SignatureVerifier.verifySignature(signedData: signedData, signature: signature, publicKey: publicKey)
        } else {
            verificationResult = false
        }
    }
    
    private func redeemTicket(ticketDTO: TicketDTO) {
        ApiService.shared.redeemTicket(ticketId: ticketDTO.id) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    var redeemedTicket = ticketDTO
                    redeemedTicket.isRedeemed = true
                    viewModel.saveRedeemedTicket(redeemedTicket)
                    self.alertMessage = "Das Ticket wurde erfolgreich entwertet."
                    self.showAlert = true
                case .failure:
                    self.alertMessage = "Das Entwerten des Tickets ist fehlgeschlagen."
                    self.showAlert = true
                }
            }
        }
    }
}
