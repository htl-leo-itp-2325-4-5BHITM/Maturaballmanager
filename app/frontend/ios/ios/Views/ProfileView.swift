import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authService: AuthService
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Profile")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            VStack(alignment: .leading, spacing: 10) {
                Text("Name: \(authService.userInfo["name"] as? String ?? "N/A")")
                    .font(.title2)
                
                if let realmAccess = authService.userInfo["realm_access"] as? [String: Any],
                   let roles = realmAccess["roles"] as? [String] {
                    VStack(alignment: .leading) {
                        Text("Roles:")
                            .font(.title3)
                            .fontWeight(.bold)
                        ForEach(roles, id: \.self) { role in
                            Text(role)
                                .font(.body)
                        }
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(10)
            
            Spacer()
            
            Button(action: logout) {
                Text("Logout")
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.red)
                    .cornerRadius(10)
            }
            .padding()
        }
        .padding()
        .onAppear {
            print("ProfileView appeared")
            print("User info: \(authService.userInfo)")
        }
    }
    
    func logout() {
        authService.token = nil
        authService.userInfo = [:]
        print("User logged out")
    }
}

