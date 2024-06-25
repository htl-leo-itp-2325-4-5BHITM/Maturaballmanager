
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
