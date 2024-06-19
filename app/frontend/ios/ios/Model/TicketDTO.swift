import Foundation

struct TicketDTO: Codable, Hashable, Identifiable {
    let uuid: UUID = UUID()
    let id: Int
    let user: UserDTO
    let digitalSignature: String
    var isRedeemed: Bool?
    
    static func == (lhs: TicketDTO, rhs: TicketDTO) -> Bool {
            return lhs.id == rhs.id
        }

        func hash(into hasher: inout Hasher) {
            hasher.combine(id)
        }
}
