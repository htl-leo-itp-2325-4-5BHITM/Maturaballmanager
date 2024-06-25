import Foundation

class ApiService {
    static let shared = ApiService()
    @Published var APP_CONFIG = AppConfig()

    private init() {}

    func redeemTicket(ticketId: Int, completion: @escaping (Result<Bool, Error>) -> Void) {
        guard let url = URL(string: "\(APP_CONFIG.API_URL)/tickets/redeem/\(ticketId)?c=\(Date().timeIntervalSince1970)") else {
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

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                completion(.failure(ApiError.failedRequest))
                return
            }
            
            completion(.success(true))
        }.resume()
    }

    func checkRedeemedStatus(ticketId: Int, completion: @escaping (Result<Bool, Error>) -> Void) {
        guard let url = URL(string: "\(APP_CONFIG.API_URL)/tickets/status/\(ticketId)") else {
            completion(.failure(ApiError.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(ApiError.noData))
                return
            }

            do {
                let status = try JSONDecoder().decode(Bool.self, from: data)
                completion(.success(status))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    func redeemAllTickets(ticketIds: [Int], completion: @escaping (Result<Bool, Error>) -> Void) {
        guard let url = URL(string: "\(APP_CONFIG.API_URL)/tickets/redeem/all") else {
            completion(.failure(ApiError.invalidURL))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        request.httpBody = try? JSONEncoder().encode(ticketIds)

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                completion(.failure(ApiError.failedRequest))
                return
            }
            
            completion(.success(true))
        }.resume()
    }

    func fetchFAQ(completion: @escaping (Result<[FAQ], Error>) -> Void) {
        guard let url = URL(string: "\(APP_CONFIG.API_URL)/faq") else {
            completion(.failure(ApiError.invalidURL))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(ApiError.noData))
                return
            }

            do {
                let decodedFAQs = try JSONDecoder().decode([FAQ].self, from: data)
                completion(.success(decodedFAQs))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    enum ApiError: Error {
        case invalidURL
        case failedRequest
        case noData
    }
}
