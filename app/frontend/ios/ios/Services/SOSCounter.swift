import SwiftUI

class SOSCounter: ObservableObject {
    static let shared = SOSCounter()
    
    @Published var count: Int = 0
    
    func loadSOSCount() {
        if let storedData = UserDefaults.standard.array(forKey: "storedTickets") as? [Data] {
            let decodedTickets = storedData.compactMap { try? JSONDecoder().decode(TicketDTO.self, from: $0) }
            count = Array(Set(decodedTickets)).count
        }
    }
}
