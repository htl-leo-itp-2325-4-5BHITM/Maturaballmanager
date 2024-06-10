import SwiftUI

struct ProfileView: View {
    @ObservedObject var sosCounter: SOSCounter
    var body: some View {
        VStack(spacing: 20) {
            // Profil Titel
            Text("Profil")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.top, 20)
            
            Spacer()
            
            // Name und Rolle Details
            VStack(alignment: .leading, spacing: 20) {
                HStack {
                    Text("Name:")
                        .font(.headline)
                    Spacer()
                    Text("Max Mustermann")
                        .font(.subheadline)
                }
                
                Divider()
                
                HStack {
                    Text("Rolle:")
                        .font(.headline)
                    Spacer()
                    Text("Maturaballleiter")
                        .font(.subheadline)
                }
                
                Divider()
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            // Logout Button
            Button(action: {
                // Handle logout action
            }) {
                Text("Logout")
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .padding(.horizontal, 20)
            
            Spacer()
        }
    }
    
}
