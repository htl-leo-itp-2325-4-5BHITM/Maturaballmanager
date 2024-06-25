import Foundation
import Security

class SignatureVerifier {
    static func verifySignature(signedData: String, signature: String, publicKey: SecKey) -> Bool {
        guard let signedData = signedData.data(using: .utf8),
              let signatureData = Data(base64Encoded: signature) else {
            print("Failed to convert data")
            return false
        }

        var error: Unmanaged<CFError>?
        let algorithm: SecKeyAlgorithm = .rsaSignatureMessagePKCS1v15SHA256

        let result = SecKeyVerifySignature(publicKey, algorithm, signedData as CFData, signatureData as CFData, &error)

        if let error = error {
            print("Error verifying signature: \(error.takeRetainedValue())")
        }

        return result
    }
}
