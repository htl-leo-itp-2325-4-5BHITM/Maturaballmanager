import SwiftUI

@main
struct iosApp: App {
    let persistenceController = PersistenceController.shared

    init() {
            UITabBar.appearance().backgroundColor = UIColor.systemBackground
        }
        
    var body: some Scene {
        WindowGroup {
            ContentView()
                .accentColor(.blue)
        }
    }
}
