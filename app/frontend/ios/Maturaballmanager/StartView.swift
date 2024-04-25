import SwiftUI
struct StartView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
            
            ScannerView()
                .tabItem {
                    Image(systemName: "qrcode.viewfinder")
                    Text("Scan")
                }
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("Einstellungen")
                }
        }
        .accentColor(.blue)
        .background(Color.black.opacity(0.1))
        .edgesIgnoringSafeArea(.bottom)
    }
}

#Preview {
    StartView()
}
