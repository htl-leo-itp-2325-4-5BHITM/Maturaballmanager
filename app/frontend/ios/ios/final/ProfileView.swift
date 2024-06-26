import SwiftUI

struct ProfileView: View {
    @ObservedObject var viewModel = ProfileViewModel()
    
    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading {
                    VStack {
                        Spacer()
                        ProgressView("Laden...")
                            .progressViewStyle(CircularProgressViewStyle())
                            .padding()
                        Spacer()
                    }
                } else {
                    ScrollView {
                        VStack(spacing: 20) {
                            ProfileHeaderView(userInfo: viewModel.userInfo)
                            ProfileDetailsView(userInfo: viewModel.userInfo)
                            LogoutButton()
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Profil")
        }
    }
}

struct ProfileHeaderView: View {
    var userInfo: [String: Any]

    var body: some View {
        VStack {
            Image("profile_picture_placeholder")
                .resizable()
                .frame(width: 100, height: 100)
                .clipShape(Circle())
                .overlay(Circle().stroke(Color.gray, lineWidth: 2))
                .shadow(radius: 5)

            Text(userInfo["name"] as? String ?? "Max Mustermann")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, 10)
            
            if let realmAccess = userInfo["realm_access"] as? [String: Any],
               let roles = realmAccess["roles"] as? [String], let firstRole = roles.first {
                Text(firstRole)
                    .font(.headline)
                    .foregroundColor(.secondary)
            } else {
                Text("Keine Rolle ausgewählt.")
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
        }
    }
}

struct ProfileDetailsView: View {
    var userInfo: [String: Any]

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Email:")
                    .font(.headline)
                Spacer()
                Text(userInfo["email"] as? String ?? "max.mustermann@example.com")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Divider()
            HStack {
                Text("Telefon:")
                    .font(.headline)
                Spacer()
                Text(userInfo["phone"] as? String ?? "123-456-7890")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Divider()
            HStack {
                Text("Adresse:")
                    .font(.headline)
                Spacer()
                Text(userInfo["address"] as? String ?? "Musterstraße 1, 12345 Musterstadt")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}

struct LogoutButton: View {
    @EnvironmentObject var authService: AuthService

    var body: some View {
        Button(action: logout) {
            Text("Ausloggen")
                .foregroundColor(.white)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.red)
                .cornerRadius(10)
                .padding(.horizontal)
        }
    }

    func logout() {
        authService.token = nil
        authService.userInfo = [:]
    }
}
