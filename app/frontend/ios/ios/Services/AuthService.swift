import Foundation

class AuthService: ObservableObject {
    static let shared = AuthService()
    
    @Published var isAuthenticated = false
    @Published var username: String = ""
    @Published var roles: [String] = []
    
    private let loginURL = URL(string: "https://mbm.tommyneumaier.at/quarkus/api/auth/login")!
    private let userInfoURL = URL(string: "https://mbm.tommyneumaier.at/quarkus/api/auth/userinfo")!
    
    private init() {}
    
    func login(username: String, password: String, completion: @escaping (Result<Bool, Error>) -> Void) {
        var request = URLRequest(url: loginURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = ["username": username, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "auth", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }

            do {
                let rawResponse = String(data: data, encoding: .utf8) ?? "No raw response"
                print("Raw response: \(rawResponse)")
                
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let accessToken = json["access_token"] as? String {
                    UserDefaults.standard.set(accessToken, forKey: "accessToken")
                    DispatchQueue.main.async {
                        self.isAuthenticated = true
                    }
                    self.fetchUserInfo(accessToken: accessToken)
                    completion(.success(true))
                } else {
                    completion(.failure(NSError(domain: "auth", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])))
                }
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func logout() {
        self.isAuthenticated = false
        self.username = ""
        self.roles = []
        UserDefaults.standard.removeObject(forKey: "accessToken")
    }
    
    func getAccessToken() -> String? {
        return UserDefaults.standard.string(forKey: "accessToken")
    }
    
    private func fetchUserInfo(accessToken: String) {
        var request = URLRequest(url: userInfoURL)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Failed to fetch user info: \(error)")
                return
            }

            guard let data = data else {
                print("No data received")
                return
            }

            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    DispatchQueue.main.async {
                        self.username = json["preferred_username"] as? String ?? "Unknown"
                        self.roles = json["roles"] as? [String] ?? []
                    }
                } else {
                    print("Invalid response format")
                }
            } catch {
                print("Failed to parse user info: \(error)")
            }
        }.resume()
    }
}
