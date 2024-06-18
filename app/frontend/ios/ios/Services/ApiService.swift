import Foundation

class ApiService {
    static let shared = ApiService()
    private init() {}

    private let baseURL = "https://5168-77-119-213-34.ngrok-free.app/api/"

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

    func checkRedeemedStatus(ticketId: Int, completion: @escaping (Result<Bool, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/tickets/status/\(ticketId)") else {
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
                let decoder = JSONDecoder()
                let status = try decoder.decode(Bool.self, from: data)
                completion(.success(status))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    func redeemAllTickets(ticketIds: [Int], completion: @escaping (Result<Bool, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/tickets/redeem/all") else {
            completion(.failure(ApiError.invalidURL))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [Int] = ticketIds
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

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
        case noData
    }
}
