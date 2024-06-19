import SwiftUI
import Combine

class TicketViewModel: ObservableObject {
    @Published var tickets: [TicketDTO] = []
    
    init() {
        loadStoredTickets()
    }
    
    func loadStoredTickets() {
        if let storedData = UserDefaults.standard.array(forKey: "redeemedTickets") as? [Data] {
            let decodedTickets = storedData.compactMap { try? JSONDecoder().decode(TicketDTO.self, from: $0) }
            self.tickets = Array(Set(decodedTickets))
        }
    }
    
    func saveRedeemedTicket(_ ticket: TicketDTO) {
        var currentTickets = tickets
        currentTickets.append(ticket)
        tickets = currentTickets
        
        let encodedTickets = tickets.compactMap { try? JSONEncoder().encode($0) }
        UserDefaults.standard.set(encodedTickets, forKey: "redeemedTickets")
    }
}
