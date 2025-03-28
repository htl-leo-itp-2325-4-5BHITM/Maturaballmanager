import SwiftUI

@main
struct Application: App {
    @StateObject private var authService = AuthService.shared
    @StateObject private var snackbarManager = SnackbarManager()
    @StateObject private var sosCounter = SOSCounter.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authService)
                .environmentObject(snackbarManager)
                .environmentObject(sosCounter)
        }
    }
}
