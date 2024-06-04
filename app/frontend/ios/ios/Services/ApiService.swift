import Foundation

class ApiService {
    static let shared = ApiService()
    private init() {}
    
    private let baseURL = "http://localhost:8080/api"  // Ersetzen Sie dies durch Ihre tatsächliche Backend-URL

    func redeemTicket(ticketId: Int, completion: @escaping (Result<Bool, Error>) -> Void) {
            guard let url = URL(string: "\(baseURL)/tickets/redeem/\(ticketId)") else {
                print("Invalid URL")
                completion(.failure(ApiError.invalidURL))
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"

            URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    completion(.failure(error))
                    return
                }

                if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                    completion(.success(true))
                } else {
                    completion(.failure(ApiError.failedRequest))
                }
            }.resume()
        }
    
    enum ApiError: Error {
            case invalidURL
            case failedRequest
        }
}
