import Foundation

class AppConfig: ObservableObject {
    @Published public private(set) var AUTH_SERVER_URL: String = "https://auth.htl-leonding.ac.at/realms/2425-5bhitm/protocol/openid-connect"
    @Published public private(set) var API_URL: String = "https://2ede-90-146-87-134.ngrok-free.app/api/"
}
