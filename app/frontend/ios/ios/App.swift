import SwiftUI

@main
struct iosApp: App {
    @StateObject private var authService = AuthService.shared
    @StateObject private var snackbarManager = SnackbarManager()
    @StateObject private var sosCounter = SOSCounter.shared
    @StateObject private var networkMonitor = NetworkMonitor()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authService)
                .environmentObject(snackbarManager)
                .environmentObject(sosCounter)
                .environmentObject(networkMonitor)
        }
    }
}
