import SwiftUI
import Combine

class SnackbarManager: ObservableObject {
    @Published var isShowing = false
    @Published var message = ""

    func show(message: String) {
        self.message = message
        self.isShowing = true

        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.isShowing = false
        }
    }
}

struct SnackbarView: View {
    @EnvironmentObject var snackbarManager: SnackbarManager

    var body: some View {
        VStack {
            Spacer()
            if snackbarManager.isShowing {
                HStack {
                    Text(snackbarManager.message)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(8)
                        .transition(.slide)
                        .animation(.easeInOut)
                }
                .padding()
            }
        }
    }
}
