import SwiftUI

struct ProfileView: View {
    @ObservedObject var sosCounter: SOSCounter

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                HStack {
                    Spacer()
                    NavigationLink(destination: FAQView()) {
                        Image(systemName: "info.circle")
                            .font(.title)
                            .padding()
                    }
                }
                .padding(.trailing, 20)
                
                Text("Profil")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 20)
                
                Spacer()
                
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
                
                Button(action: {
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
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView(sosCounter: SOSCounter())
    }
}
