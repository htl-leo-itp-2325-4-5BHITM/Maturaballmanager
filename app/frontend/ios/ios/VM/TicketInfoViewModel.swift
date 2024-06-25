import SwiftUI

class TicketInfoViewModel: ObservableObject {
    @Published var ticketDTO: TicketDTO?
    @Published var dataInvalid = false
    @Published var isRedeemed = false
    @Published var verificationResult: Bool?

    init(ticketDTO: TicketDTO?) {
        self.ticketDTO = ticketDTO
        self.isRedeemed = ticketDTO?.isRedeemed ?? false
        verifySignature()
    }

    private func verifySignature() {
        guard let ticketDTO = ticketDTO else { return }

        let publicKey = PublicKeyLoader.loadPublicKey()
        let signedData = "Issuer: HTL Leonding"
        let signature = ticketDTO.digitalSignature

        if let publicKey = publicKey {
            verificationResult = SignatureVerifier.verifySignature(signedData: signedData, signature: signature, publicKey: publicKey)
        } else {
            verificationResult = false
        }
    }

    func redeemTicket(completion: @escaping (Bool) -> Void) {
        guard let ticketDTO = ticketDTO else { return }

        ApiService.shared.redeemTicket(ticketId: ticketDTO.id) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.isRedeemed = true
                    self.ticketDTO?.isRedeemed = true
                    completion(true)
                case .failure:
                    completion(false)
                }
            }
        }
    }
}
