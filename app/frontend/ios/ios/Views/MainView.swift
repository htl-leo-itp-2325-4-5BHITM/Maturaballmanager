import SwiftUI

struct MainView: View {
    var body: some View {
        NavigationView {
            TabView {
                ScannerView(sosCounter: SOSCounter())
                    .tabItem {
                        Image(systemName: "qrcode.viewfinder")
                        Text("Scanner")
                    }

                SOSView()
                    .tabItem {
                        Image(systemName: "exclamationmark.triangle")
                        Text("SOS")
                    }
                    .badge(Int(UserDefaults.standard.array(forKey: "storedTickets")!.count))

                ProfileView()
                    .tabItem {
                        Image(systemName: "person.fill")
                        Text("Profile")
                    }
            }
        }
    }
    
    private func getSOSCount() -> Int {
        if let count = UserDefaults.standard.array(forKey: "storedTickets")?.count {
            return count
        }
        return 0
    }
}
