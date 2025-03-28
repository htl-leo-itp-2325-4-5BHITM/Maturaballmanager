import Foundation
import Security

class PublicKeyLoader {
    static func loadPublicKey() -> SecKey? {
        guard let url = Bundle.main.url(forResource: "public_key", withExtension: "pem") else {
            print("Public key file not found")
            return nil
        }

        do {
            let keyString = try String(contentsOf: url, encoding: .utf8)
                .replacingOccurrences(of: "-----BEGIN PUBLIC KEY-----", with: "")
                .replacingOccurrences(of: "-----END PUBLIC KEY-----", with: "")
                .replacingOccurrences(of: "\n", with: "")

            guard let keyData = Data(base64Encoded: keyString) else {
                print("Failed to decode base64 public key")
                return nil
            }

            let options: [String: Any] = [
                kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
                kSecAttrKeyClass as String: kSecAttrKeyClassPublic,
                kSecAttrKeySizeInBits as String: 2048
            ]

            var error: Unmanaged<CFError>?
            guard let publicKey = SecKeyCreateWithData(keyData as CFData, options as CFDictionary, &error) else {
                print("Error creating public key: \(String(describing: error?.takeRetainedValue()))")
                return nil
            }

            return publicKey
        } catch {
            print("Error loading public key: \(error)")
            return nil
        }
    }
}
