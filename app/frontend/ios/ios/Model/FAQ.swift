import Foundation

struct FAQ: Codable, Identifiable {
    var id: UUID = UUID()
    var question: String = ""
    var answer: String = ""
}
