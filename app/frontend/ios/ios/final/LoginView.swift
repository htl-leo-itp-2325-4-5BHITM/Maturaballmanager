import SwiftUI
struct LoginView: View {
    @State private var username: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String?

    @EnvironmentObject var authService: AuthService

    var body: some View {
        VStack {
            Spacer()

            Image("school_logo.png")
                .resizable()
                .scaledToFit()
                .frame(width: 150, height: 150)
                .padding(.bottom, 20)
            
            Text("Maturaballmanager")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.bottom, 20)

            CustomTextField(placeholder: "Schulbenutzername", text: $username)
            CustomTextField(placeholder: "Passwort", text: $password, isSecure: true)

            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            }

            CustomButton(title: "Anmelden", action: {
                login(username: username, password: password)
            })
            
            Spacer()
        }
        .padding()
    }

    func login(username: String, password: String) {
        authService.fetchToken(username: username, password: password) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.errorMessage = nil
                case .failure(let error):
                    self.errorMessage = "Kein Account zu den eingegeben Daten gefunden."
                }
            }
        }
    }
}
