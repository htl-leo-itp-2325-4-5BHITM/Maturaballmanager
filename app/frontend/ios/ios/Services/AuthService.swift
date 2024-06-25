import Foundation

class AuthService: ObservableObject {
    static let shared = AuthService()
    @Published var APP_CONFIG = AppConfig()

    @Published var token: String?
    @Published var userInfo: [String: Any] = [:]

    private init() {}

    func fetchToken(username: String, password: String, completion: @escaping (Result<String, Error>) -> Void) {
        guard let url = URL(string: "\(APP_CONFIG.AUTH_SERVER_URL)/token") else {
            completion(.failure(ApiError.invalidURL))
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"

        let parameters = [
            "grant_type": "password",
            "client_id": "maturaballmanager",
            "client_secret": "C4bc62f5JmmJVMK1Iu6qTmHUdMm0eO8C",
            "username": username,
            "password": password,
            "scope": "openid"
        ]

        request.httpBody = parameters.percentEscaped().data(using: .utf8)
        request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error fetching token: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(ApiError.noData))
                return
            }

            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let accessToken = json["access_token"] as? String {
                    DispatchQueue.main.async {
                        self.token = accessToken
                        self.fetchUserInfo { result in
                            switch result {
                            case .success(let userInfo):
                                if self.hasRequiredRole(userInfo: userInfo) {
                                    completion(.success(accessToken))
                                } else {
                                    self.token = nil
                                    self.userInfo = [:]
                                    completion(.failure(ApiError.insufficientPermissions))
                                }
                            case .failure(let error):
                                completion(.failure(error))
                            }
                        }
                    }
                } else {
                    completion(.failure(ApiError.invalidResponse))
                }
            } catch {
                completion(.failure(ApiError.parsingError(error)))
            }
        }.resume()
    }

    func fetchUserInfo(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let token = token else {
            completion(.failure(ApiError.noToken))
            return
        }

        guard let url = URL(string: "\(APP_CONFIG.AUTH_SERVER_URL)/userinfo") else {
            completion(.failure(ApiError.invalidURL))
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

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
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    DispatchQueue.main.async {
                        self.userInfo = json
                    }
                    completion(.success(json))
                } else {
                    completion(.failure(ApiError.invalidResponse))
                }
            } catch {
                completion(.failure(ApiError.parsingError(error)))
            }
        }.resume()
    }

    private func hasRequiredRole(userInfo: [String: Any]) -> Bool {
        guard let realmAccess = userInfo["realm_access"] as? [String: Any],
              let roles = realmAccess["roles"] as? [String] else {
            return false
        }
        return roles.contains("Komiteemitglied") || roles.contains("Maturaballleiter")
    }
}

// Error Handling
enum ApiError: Error {
    case invalidURL
    case noData
    case invalidResponse
    case parsingError(Error)
    case noToken
    case insufficientPermissions
}

// URL Encoding Extension
extension Dictionary {
    func percentEscaped() -> String {
        return map { (key, value) in
            let escapedKey = "\(key)".addingPercentEncoding(withAllowedCharacters: .urlQueryValueAllowed) ?? ""
            let escapedValue = "\(value)".addingPercentEncoding(withAllowedCharacters: .urlQueryValueAllowed) ?? ""
            return "\(escapedKey)=\(escapedValue)"
        }
        .joined(separator: "&")
    }
}

extension CharacterSet {
    static let urlQueryValueAllowed: CharacterSet = {
        var characterSet = CharacterSet.urlQueryAllowed
        characterSet.remove(charactersIn: "&=?")
        return characterSet
    }()
}
