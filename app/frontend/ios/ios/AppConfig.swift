import Foundation

class AppConfig: ObservableObject {
    @Published public private(set) var AUTH_SERVER_URL: String = "https://auth.htl-leonding.ac.at/realms/2425-5bhitm/protocol/openid-connect"
    @Published public private(set) var API_URL: String = "https://3555-178-165-183-103.ngrok-free.app/api/"
}
