import Foundation

extension Data {
    func sortedJSON() -> Data? {
        guard let jsonObject = try? JSONSerialization.jsonObject(with: self, options: []) else {
            return nil
        }
        guard let sortedData = try? JSONSerialization.data(withJSONObject: jsonObject, options: [.sortedKeys]) else {
            return nil
        }
        return sortedData
    }
}
