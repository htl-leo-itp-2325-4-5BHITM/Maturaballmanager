import SwiftUI

struct WarningSymbol: View {
    var color: Color
    var message: String

    var body: some View {
        VStack {
            Image(systemName: "exclamationmark.triangle.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(color)
                .padding(.top, 20)
            
            Text(message)
                .foregroundColor(color)
                .font(.headline)
                .multilineTextAlignment(.center)
                .padding()
        }
    }
}
