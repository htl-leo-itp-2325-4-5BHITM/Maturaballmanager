import SwiftUI

struct TicketDetailView: View {
    let ticket: TicketDTO
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Details")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.top, 20)
            
            Spacer()
            
            VStack(alignment: .leading, spacing: 20) {
                HStack {
                    Text("Ticketnr:")
                        .font(.headline)
                    Spacer()
                    Text(String(ticket.id))
                        .font(.subheadline)
                }
                
                HStack {
                    Text("Name:")
                        .font(.headline)
                    Spacer()
                    Text(ticket.user.firstName + " " + ticket.user.lastName)
                        .font(.subheadline)
                }
                
                HStack {
                    Text("Gültig bis:")
                        .font(.headline)
                    Spacer()
                    Text("Freitag, 05.03.2025 um 01:00 Uhr")
                        .font(.subheadline)
                }
                
                HStack {
                    Text("Ticketart:")
                        .font(.headline)
                    Spacer()
                    Text(ticket.isRedeemed ?? false ? "Entwertet" : "Nicht entwertet")
                        .font(.subheadline)
                }
            }
            .padding(.horizontal, 20)
            
            Spacer()
        }
        .navigationBarTitle("Details", displayMode: .inline)
    }
}
