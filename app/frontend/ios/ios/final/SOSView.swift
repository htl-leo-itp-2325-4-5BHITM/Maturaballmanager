import SwiftUI

struct SOSView: View {
    @ObservedObject private var viewModel: SOSViewModel = SOSViewModel()
    
    var body: some View {
        NavigationView {
            VStack {
                List {
                    ForEach(viewModel.storedTickets, id: \.id) { ticket in
                        HStack {
                            VStack(alignment: .leading) {
                                Text("T.-Nr.: \(ticket.id)")
                                Text("Name: \(ticket.user.sex == "male" ? "Hr." : "Fr.") \(ticket.user.firstName) \(ticket.user.lastName)")
                                Text("VIP Status: \(ticket.user.vipStatus ? "Ja" : "Nein")")
                            }
                            Spacer()
                            if ticket.user.vipStatus {
                                Image(systemName: "crown.fill")
                                    .foregroundColor(.yellow)
                            }
                            Button(action: {
                                viewModel.redeemStoredTicket(ticket: ticket)
                            }) {
                                Text("Entwerten")
                                    .foregroundColor(.red)
                            }
                        }
                    }
                }
                .navigationBarTitle("SOS Tickets")

                Button(action: viewModel.redeemAllTickets) {
                    Text("Alle entwerten")
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.red)
                        .cornerRadius(10)
                }
                .padding()
            }
        }
    }
}
