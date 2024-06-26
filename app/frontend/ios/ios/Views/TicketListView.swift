import SwiftUI

struct TicketListView: View {
    @ObservedObject var viewModel = TicketViewModel()
    
    var body: some View {
        NavigationStack {
            VStack {
                if viewModel.tickets.isEmpty {
                    Text("Keine entwerteten Tickets")
                        .foregroundColor(.gray)
                        .italic()
                        .padding()
                } else {
                    List(viewModel.tickets) { ticket in
                        NavigationLink(destination: TicketDetailView(ticket: ticket)) {
                            TicketListRow(ticket: ticket)
                        }
                    }
                    .listStyle(InsetGroupedListStyle())
                }
            }
            .navigationTitle("Entwertete Tickets")
        }
    }
}

struct TicketListRow: View {
    var ticket: TicketDTO
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Ticket-Nr.: \(ticket.id)")
                .font(.headline)
            Text("\(ticket.user.sex == "male" ? "Hr." : "Fr.") \(ticket.user.firstName) \(ticket.user.lastName)")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 8)
    }
}

struct TicketListView_Previews: PreviewProvider {
    static var previews: some View {
        TicketListView()
    }
}
