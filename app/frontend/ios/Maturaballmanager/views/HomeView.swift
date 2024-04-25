import SwiftUI

struct HomeView: View {
    var body: some View {
        ScrollView {
                    VStack(spacing: 20) {
                        Image("htllogo_2022_black_v2")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 300, height: 100)
                            .padding(.top, 10)
                        
                        Text("Willkommen!")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                            .padding(.top, 25)
                        
                        Text("Mit dem Maturaballmanager kannst du Eintrittskarten für den Maturaball einfach überprüfen.")
                            .font(.callout)
                            .multilineTextAlignment(.center)
                            .padding()
                    }
                    .padding(.bottom, 50)
                }
    }
}

#Preview {
    StartView()
}
