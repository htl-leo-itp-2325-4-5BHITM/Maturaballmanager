import Foundation

struct UserDTO: Codable, Hashable {
    let firstName: String
    let lastName: String
    let sex: String
    let vipStatus: Bool
}
