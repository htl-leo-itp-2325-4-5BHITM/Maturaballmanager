import Foundation

class FAQViewModel: ObservableObject {
    @Published var faqs: [FAQ] = []
    
    func fetchFAQs() {
        guard let url = URL(string: "https://mbm.tommyneumaier.at/quarkus/api/faq") else { return }
        
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
