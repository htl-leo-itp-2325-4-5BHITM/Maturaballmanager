import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            TabView {
                ScannerView()
                    .tabItem {
                        Image(systemName: "qrcode.viewfinder")
                        Text("Scanner")
                    }
                
                Text("Other Tab")
                    .tabItem {
                        Image(systemName: "square.grid.2x2")
                        Text("Other")
                    }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
