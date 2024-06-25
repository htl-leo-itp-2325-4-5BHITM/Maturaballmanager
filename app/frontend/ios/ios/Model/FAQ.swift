import Foundation

struct FAQ: Codable, Identifiable {
    var id: Int
    var question: String = ""
    var answer: String = ""
}
