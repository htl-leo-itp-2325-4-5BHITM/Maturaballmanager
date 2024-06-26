import SwiftUI

class FAQViewModel: ObservableObject {
    @Published var faqs: [FAQ] = []
    @Published var isLoading: Bool = false

    func fetchFAQs() {
        isLoading = true
        ApiService.shared.fetchFAQ { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                case .success(let faqs):
                    self.faqs = faqs
                case .failure(let error):
                    print("Error fetching FAQs: \(error.localizedDescription)")
                }
            }
        }
    }
}
