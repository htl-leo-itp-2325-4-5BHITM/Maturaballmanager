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
                
                SOSView(sosCounter: SOSCounter())
                    .tabItem {
                        Image(systemName: "exclamationmark.triangle")
                        Text("SOS")
                    }
                
                SettingsView()
                    .tabItem {
                        Image(systemName: "gearshape.fill")
                        Text("Einstellungen")
                    }
            }
        }
    }
}
