import SwiftUI

struct TicketInfoView: View {
    @ObservedObject var viewModel: TicketInfoViewModel
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var snackbarManager: SnackbarManager

    var body: some View {
        VStack(spacing: 20) {
            if viewModel.dataInvalid {
                WarningSymbol(color: .red, message: "Ungültiger QR-Code. Bitte kontaktiere einen Verantwortlichen.")
                Spacer()
            } else if let ticketDTO = viewModel.ticketDTO {
                VStack(spacing: 20) {
                    if viewModel.isRedeemed {
                        WarningSymbol(color: .yellow, message: "Dieses Ticket von \(ticketDTO.user.sex == "male" ? "Hr." : "Fr.") \(ticketDTO.user.firstName) \(ticketDTO.user.lastName) wurde bereits entwertet.")
                    } else {
                        Image(systemName: "checkmark.circle.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 100, height: 100)
                            .foregroundColor(.green)
                            .padding(.top, 20)

                        Text("Ticket-Nr.: \(ticketDTO.id)")
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, 10)

                        Text("Name: \(ticketDTO.user.sex == "male" ? "Hr." : "Fr.") \(ticketDTO.user.firstName) \(ticketDTO.user.lastName)")
                            .font(.headline)
                            .padding(.top, 5)

                        Text("Geschlecht: \(ticketDTO.user.sex == "male" ? "männlich" : "weiblich")")
                            .font(.headline)
                            .padding(.top, 5)

                        Text("VIP Status: \(ticketDTO.user.vipStatus ? "Ja" : "Nein")")
                            .font(.headline)
                            .padding(.top, 5)

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
                                .frame(maxWidth: .infinity)
                                .background(Color.red)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                                .padding(.horizontal, 20)
                        }
                        .padding(.top, 20)

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
