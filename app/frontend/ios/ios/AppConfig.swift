import Foundation

class AppConfig: ObservableObject {
    @Published public private(set) var AUTH_SERVER_URL: String = "https://auth.htl-leonding.ac.at/realms/2425-5bhitm/protocol/openid-connect"
    @Published public private(set) var API_URL: String = "https://26f5-193-170-158-243.ngrok-free.app/api"
}
