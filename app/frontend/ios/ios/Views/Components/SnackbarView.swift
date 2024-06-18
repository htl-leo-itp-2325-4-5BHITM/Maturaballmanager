import SwiftUI
import Combine

class SnackbarManager: ObservableObject {
    @Published var isShowing = false
    @Published var message = ""
    @Published var progress: Double = 1.0
    
    private var timer: AnyCancellable?
    
    func show(message: String, duration: TimeInterval = 2.0) {
        self.message = message
        self.isShowing = true
        self.progress = 1.0
        
        timer?.cancel()
        timer = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                if self.progress > 0 {
                    self.progress -= 0.1 / duration
                } else {
                    self.hide()
                }
            }
    }
    
    func hide() {
        timer?.cancel()
        self.isShowing = false
    }
}

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
