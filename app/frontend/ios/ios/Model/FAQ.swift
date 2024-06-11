import Foundation

struct FAQ: Identifiable, Decodable {
    let id: Int
    let question: String
    let answer: String
}
