import SwiftUI

struct ContentView: View {
    @ObservedObject var authService = AuthService.shared
    
    var body: some View {
        Group {
            if authService.token != nil {
                MainView()
                    .environmentObject(authService)
            } else {
                LoginView()
                    .environmentObject(authService)
            }
        }
        .onAppear {
            print("ContentView appeared, token: \(String(describing: authService.token))")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
