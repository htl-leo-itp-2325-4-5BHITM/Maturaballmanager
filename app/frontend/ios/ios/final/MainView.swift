import SwiftUI

struct MainView: View {
    @ObservedObject var sosViewModel = SOSViewModel()
    
    var body: some View {
        TabView {
            ScannerView()
                .tabItem {
                    Image(systemName: "qrcode.viewfinder")
                    Text("Scanner")
                }
            
            SOSView()
                .tabItem {
                    Image(systemName: "exclamationmark.triangle")
                    Text("SOS")
                }
                .badge(sosViewModel.storedTickets.count)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("Einstellungen")
                }
        }
    }
}
