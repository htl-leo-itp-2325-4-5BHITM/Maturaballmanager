import Foundation

class AuthService: ObservableObject {
    static let shared = AuthService()
    
    @Published var token: String?
    @Published var userInfo: [String: Any] = [:]
    
    private let baseUrl = "https://auth.htl-leonding.ac.at/realms/2425-5bhitm/protocol/openid-connect"
    
    private init() {}
    
    func fetchToken(username: String, password: String, completion: @escaping (Result<String, Error>) -> Void) {
        let url = URL(string: "\(baseUrl)/token")!
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
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error fetching token: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                let error = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "No data received from server"])
                print("No data received")
                completion(.failure(error))
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let accessToken = json["access_token"] as? String {
                    DispatchQueue.main.async {
                        self.token = accessToken
                        print("Token received: \(accessToken)")
                        self.fetchUserInfo { result in
                            switch result {
                            case .success(let userInfo):
                                print("User info: \(userInfo)")
                                if self.hasRequiredRole(userInfo: userInfo) {
                                    completion(.success(accessToken))
                                } else {
                                    let error = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "You do not have the required permissions to log in"])
                                    print("User does not have required role")
                                    self.token = nil
                                    self.userInfo = [:]
                                    completion(.failure(error))
                                }
                            case .failure(let error):
                                print("Failed to fetch user info: \(error.localizedDescription)")
                                completion(.failure(error))
                            }
                        }
                    }
                } else {
                    let error = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "Invalid response from server"])
                    print("Invalid response: \(String(describing: String(data: data, encoding: .utf8)))")
                    completion(.failure(error))
                }
            } catch {
                print("Error parsing token response: \(error.localizedDescription)")
                let parseError = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "Error parsing server response"])
                completion(.failure(parseError))
            }
        }
        
        task.resume()
    }
    
    func fetchUserInfo(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let token = token else {
            let error = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "No token available"])
            print("No token available")
            completion(.failure(error))
            return
        }
        
        let url = URL(string: "\(baseUrl)/userinfo")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error fetching user info: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                let error = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "No data received from server"])
                print("No data received")
                completion(.failure(error))
                return
            }
            
            if let rawString = String(data: data, encoding: .utf8) {
                print("Raw user info data: \(rawString)")
            } else {
                print("Unable to convert user info data to string.")
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    DispatchQueue.main.async {
                        self.userInfo = json
                        print("User info received: \(json)")
                    }
                    completion(.success(json))
                } else {
                    let error = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "Invalid response from server"])
                    print("Invalid response: \(String(describing: String(data: data, encoding: .utf8)))")
                    completion(.failure(error))
                }
            } catch {
                print("Error parsing user info response: \(error.localizedDescription)")
                let parseError = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "Error parsing user info from server"])
                completion(.failure(parseError))
            }
        }
        
        task.resume()
    }
    
    private func hasRequiredRole(userInfo: [String: Any]) -> Bool {
        guard let realmAccess = userInfo["realm_access"] as? [String: Any],
              let roles = realmAccess["roles"] as? [String] else {
            return false
        }
        return roles.contains("Komiteemitglied") || roles.contains("Maturaballleiter")
    }
}

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
