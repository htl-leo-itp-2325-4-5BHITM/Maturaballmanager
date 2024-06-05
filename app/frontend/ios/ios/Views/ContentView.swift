import SwiftUI

struct ContentView: View {
    @StateObject private var sosCounter = SOSCounter()

    var body: some View {
        NavigationView {
            TabView {
                ScannerView(sosCounter: sosCounter)
                    .tabItem {
                        Image(systemName: "qrcode.viewfinder")
                        Text("Scanner")
                    }
                
                SOSView(sosCounter: sosCounter)
                    .tabItem {
                        ZStack {
                            Image(systemName: "exclamationmark.triangle")
                            Text("SOS")
                            if sosCounter.count > 0 {
                                Badge(count: sosCounter.count)
                                    .offset(x: 20, y: -10)
                            }
                        }
                    }
            }
        }
    }
}

struct Badge: View {
    let count: Int

    var body: some View {
        ZStack {
            Circle()
                .foregroundColor(.red)
            Text("\(count)")
                .foregroundColor(.white)
                .font(.caption)
        }
        .frame(width: 20, height: 20)
    }
}
