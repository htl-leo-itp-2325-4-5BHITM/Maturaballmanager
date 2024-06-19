import Foundation

class FAQViewModel: ObservableObject {
    @Published var faqs: [FAQ] = []
    
    func fetchFAQs() {
        guard let url = URL(string: "https://85d1-2001-4bc9-1f90-9bbf-207b-734-80e7-9a0f.ngrok-free.app/api/faq") else { return }
        
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
