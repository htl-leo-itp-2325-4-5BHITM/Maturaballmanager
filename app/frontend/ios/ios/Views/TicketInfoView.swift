import SwiftUI

class TicketInfoViewModel: ObservableObject {
    @Published var ticketDTO: TicketDTO?
    @Published var dataInvalid = false
    @Published var isRedeemed = false
    @Published var verificationResult: Bool?

    init(ticketDTO: TicketDTO?) {
        self.ticketDTO = ticketDTO
        self.isRedeemed = ticketDTO?.isRedeemed ?? false
        self.verifySignature()
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

    func redeemTicket(completion: @escaping (Bool) -> Void) {
        guard let ticketDTO = ticketDTO else { return }

        ApiService.shared.redeemTicket(ticketId: ticketDTO.id) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.isRedeemed = true
                    self.ticketDTO?.isRedeemed = true
                    completion(true)
                case .failure:
                    completion(false)
                }
            }
        }
    }
}

struct TicketInfoView: View {
    @ObservedObject var viewModel: TicketInfoViewModel
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var snackbarManager: SnackbarManager

    var body: some View {
        VStack(spacing: 20) {
            if viewModel.dataInvalid {
                WarningSymbol()
                Spacer()
            } else if let ticketDTO = viewModel.ticketDTO {
                if viewModel.isRedeemed {
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

                            if let verificationResult = viewModel.verificationResult {
                                Text(verificationResult ? "Signatur verifiziert" : "Signatur ungültig")
                                    .font(.headline)
                                    .foregroundColor(verificationResult ? .green : .red)
                            }
                        }
                        .padding(.horizontal, 20)
                        .background(RoundedRectangle(cornerRadius: 10).fill(Color(.systemGray6)))
                        .padding(.horizontal)

                        Button(action: {
                            viewModel.redeemTicket { success in
                                if success {
                                    snackbarManager.show(message: "Das Ticket wurde erfolgreich entwertet.")
                                    presentationMode.wrappedValue.dismiss()
                                } else {
                                    snackbarManager.show(message: "Das Entwerten des Tickets ist fehlgeschlagen.")
                                }
                            }
                        }) {
                            Text("Entwerten")
                                .font(.title2)
                                .padding()
                                .background(Color.red)
                                .foregroundColor(.white)
                                .cornerRadius(10)
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
    }
}
