import SwiftUI

class SOSCounter: ObservableObject {
    @Published var count: Int = 0
    
    func loadSOSCount() {
        if let storedData = UserDefaults.standard.array(forKey: "storedTickets") as? [Data] {
            let decodedTickets = storedData.compactMap { try? JSONDecoder().decode(TicketDTO.self, from: $0) }
            count = Array(Set(decodedTickets)).count // Zählt die eindeutigen Tickets
        }
    }
}
