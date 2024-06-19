import Foundation

class FAQViewModel: ObservableObject {
    @Published var faqs: [FAQ] = []
    
    func fetchFAQs() {
        guard let url = URL(string: "https://92da-193-170-158-243.ngrok-free.app/api/faq") else { return }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let data = data {
                if let decodedFAQs = try? JSONDecoder().decode([FAQ].self, from: data) {
                    DispatchQueue.main.async {
                        self.faqs = decodedFAQs
                    }
                }
            }
        }.resume()
    }
}
