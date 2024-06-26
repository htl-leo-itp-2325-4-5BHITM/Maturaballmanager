import SwiftUI

struct SOSView: View {
    @ObservedObject private var viewModel: SOSViewModel = SOSViewModel()
    @EnvironmentObject var snackbarManager: SnackbarManager

    var body: some View {
        NavigationView {
            VStack {
                if viewModel.isLoading {
                    VStack {
                        Spacer()
                        ProgressView("Laden...")
                            .progressViewStyle(CircularProgressViewStyle())
                            .padding()
                        Spacer()
                    }
                } else if viewModel.storedTickets.isEmpty {
                    VStack {
                        Spacer()
                        Text("Keine Tickets gespeichert")
                            .foregroundColor(.gray)
                            .italic()
                            .padding()
                        Spacer()
                    }
                } else {
                    List {
                        ForEach(viewModel.storedTickets, id: \.id) { ticket in
                            TicketRow(ticket: ticket)
                        }
                    }

                    Text("Anzahl der SOS-Tickets: \(viewModel.storedTickets.count)")
                        .font(.headline)
                        .padding()
                }
            }
            .navigationTitle("SOS Tickets")

            }
            .alert(item: $viewModel.errorMessage) { errorMessage in
                Alert(title: Text("Rückmeldung"), message: Text(errorMessage.message), dismissButton: .default(Text("OK")))
            }
            .onReceive(viewModel.$successMessage) { successMessage in
                if let message = successMessage {
                    snackbarManager.show(message: message.message)
                }
            }
        }
    }

struct TicketRow: View {
    var ticket: TicketDTO

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("Ticket-Nr.: \(ticket.id)")
                Text("Name: \(ticket.user.sex == "male" ? "Hr." : "Fr.") \(ticket.user.firstName) \(ticket.user.lastName)")
                Text("VIP Status: \(ticket.user.vipStatus ? "Ja" : "Nein")")
            }
            Spacer()
            if ticket.user.vipStatus {
                Image(systemName: "crown.fill")
                    .foregroundColor(.yellow)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
        .shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
    }
}

struct SOSView_Previews: PreviewProvider {
    static var previews: some View {
        SOSView().environmentObject(SnackbarManager())
    }
}
