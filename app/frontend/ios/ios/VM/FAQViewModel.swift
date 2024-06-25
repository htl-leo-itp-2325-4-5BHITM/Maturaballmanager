import SwiftUI

class FAQViewModel: ObservableObject {
    @Published var faqs: [FAQ] = []

    func fetchFAQs() {
        ApiService.shared.fetchFAQ { result in
            DispatchQueue.main.async {
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
