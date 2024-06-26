import SwiftUI

class ProfileViewModel: ObservableObject {
    @Published var userInfo: [String: Any] = [:]
    @Published var isLoading: Bool = false

    init() {
        loadUserInfo()
    }

    func loadUserInfo() {
        isLoading = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.userInfo = AuthService.shared.userInfo
            self.isLoading = false
        }
    }
}
