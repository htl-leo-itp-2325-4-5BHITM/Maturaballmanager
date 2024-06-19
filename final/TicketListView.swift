import SwiftUI

struct TicketListView: View {
    @ObservedObject var viewModel = TicketViewModel()
    
    var body: some View {
        NavigationView {
            VStack {
                List(viewModel.tickets) { ticket in
                    NavigationLink(destination: TicketDetailView(ticket: ticket)) {
                        Text(ticket.user.firstName + " " + ticket.user.lastName)
                    }
                }
                .navigationTitle("Gescanntes Tickets")
            }
        }
    }
}
