import Foundation

struct TicketDTO: Codable {
    let id: Int
    let redeemed: Bool
    let user: UserDTO
    let digitalSignature: String
}
