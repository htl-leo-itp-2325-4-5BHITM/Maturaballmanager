import SwiftUI

struct WarningSymbol: View {
    var body: some View {
        VStack {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(.orange)
                .imageScale(.large)
                .font(.system(size: 80))
            Text("Achtung: möglicher Betrug. Kontaktiere einen Verantwortlichen.")
                .foregroundColor(.orange)
                .font(.largeTitle)
                .multilineTextAlignment(.center)
                .padding()
        }
    }
}

struct WarningSymbol_Previews: PreviewProvider {
    static var previews: some View {
        WarningSymbol()
    }
}
