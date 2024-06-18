import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authService: AuthService
    @State private var username: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String?

    var body: some View {
        NavigationView {
            VStack {
                TextField("Username", text: $username)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                    .padding(.bottom, 20)
                
                SecureField("Password", text: $password)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                    .padding(.bottom, 20)
                
                Button(action: login) {
                    Text("Login")
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(8)
                }
                
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                }
                
                Spacer()
            }
            .padding()
            .navigationBarTitle("Login", displayMode: .inline)
        }
        .onAppear {
            if authService.isAuthenticated {
                navigateToMainView()
            }
        }
    }
    
    private func login() {
        authService.login(username: username, password: password) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    navigateToMainView()
                case .failure(let error):
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
    
    private func navigateToMainView() {
        if let window = UIApplication.shared.windows.first {
            window.rootViewController = UIHostingController(rootView: ContentView().environmentObject(authService))
            window.makeKeyAndVisible()
        }
    }
}
