import Foundation

struct TicketDTO: Codable {
    let id: Int
    let user: UserDTO
    let digitalSignature: String
}
