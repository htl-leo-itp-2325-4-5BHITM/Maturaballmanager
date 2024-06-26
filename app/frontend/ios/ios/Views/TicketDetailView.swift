import SwiftUI

struct TicketDetailView: View {
    let ticket: TicketDTO
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(systemName: "ticket.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100, height: 100)
                    .foregroundColor(.red)
                    .padding(.top, 20)
                
                VStack(alignment: .leading, spacing: 10) {
                    DetailRow(label: "Ticket-Nr.:", value: "\(ticket.id)")
                    DetailRow(label: "Name:", value: "\(ticket.user.sex == "male" ? "Hr." : "Fr.") \(ticket.user.firstName) \(ticket.user.lastName)")
                    DetailRow(label: "Geschlecht:", value: "\(ticket.user.sex == "male" ? "männlich" : "weiblich")")
                    DetailRow(label: "VIP Status:", value: "\(ticket.user.vipStatus ? "Ja" : "Nein")")
                }
                .padding(.horizontal, 20)
                
                Spacer()
            }
        }
        .background(Color(.systemGroupedBackground).edgesIgnoringSafeArea(.all))
    }
}

struct DetailRow: View {
    var label: String
    var value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(.headline)
            Spacer()
            Text(value)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 5)
    }
}

struct TicketDetailView_Previews: PreviewProvider {
    static var previews: some View {
        TicketDetailView(ticket: TicketDTO(id: 12345, user: UserDTO(firstName: "John", lastName: "Doe", sex: "male", vipStatus: true), digitalSignature: "signature", isRedeemed: true))
    }
}
