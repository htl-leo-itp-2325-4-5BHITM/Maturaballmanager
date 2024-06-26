import SwiftUI

struct IdentifiableErrorMessage: Identifiable {
    var id: UUID = UUID()
    var message: String
}
