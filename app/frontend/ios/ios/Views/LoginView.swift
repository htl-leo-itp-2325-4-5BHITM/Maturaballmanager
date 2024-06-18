import SwiftUI

struct LoginView: View {
    @State private var username: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String?

    @EnvironmentObject var authService: AuthService

    var body: some View {
        VStack {
            TextField("Username", text: $username)
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(10)

            SecureField("Password", text: $password)
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(10)

            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            }

            Button(action: {
                login(username: username, password: password)
            }) {
                Text("Login")
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(10)
            }
        }
        .padding()
        .onAppear {
            print("LoginView appeared")
        }
    }

    func login(username: String, password: String) {
        authService.fetchToken(username: username, password: password) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.errorMessage = nil
                    print("Login successful, token: \(String(describing: authService.token))")
                    print("User info: \(authService.userInfo)")
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                    print("Login failed: \(error.localizedDescription)")
                }
            }
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
            .environmentObject(AuthService.shared)
    }
}
