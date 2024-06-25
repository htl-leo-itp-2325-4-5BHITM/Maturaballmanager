import SwiftUI

struct SettingsView: View {
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 0) {
                Text("Einstellungen")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 20)
                    .padding(.bottom, 20)
                    .padding(.horizontal, 20)
                
                List {
                    NavigationLink(destination: ProfileView()) {
                        HStack {
                            Image(systemName: "person.circle")
                            Text("Profil")
                        }
                    }
                    
                    NavigationLink(destination: TicketListView()) {
                        HStack {
                            Image(systemName: "clock")
                            Text("Gescanntes Tickets")
                        }
                    }
                    
                    NavigationLink(destination: FAQView()) {
                        HStack {
                            Image(systemName: "info.circle")
                            Text("FAQ")
                        }
                    }
                }
                .listStyle(InsetGroupedListStyle())
            }
        }
    }
}
