import SwiftUI

struct SnackbarView: View {
    @EnvironmentObject var snackbarManager: SnackbarManager

    var body: some View {
        VStack {
            Spacer()
            
            if snackbarManager.isShowing {
                VStack(spacing: 0) {
                    Text(snackbarManager.message)
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(8)
                        .onTapGesture {
                            snackbarManager.hide()
                        }

                    ProgressBar(progress: snackbarManager.progress)
                        .frame(height: 4)
                        .background(Color.gray)
                }
                .transition(.move(edge: .bottom))
                .animation(.easeInOut(duration: 0.3), value: snackbarManager.isShowing)
            }
        }
        .padding(.bottom, 20)
        .padding(.horizontal, 20)
    }
}

struct ProgressBar: View {
    var progress: Double

    var body: some View {
        GeometryReader { geometry in
            Rectangle()
                .fill(Color.white)
                .frame(width: geometry.size.width * CGFloat(self.progress))
        }
    }
}
