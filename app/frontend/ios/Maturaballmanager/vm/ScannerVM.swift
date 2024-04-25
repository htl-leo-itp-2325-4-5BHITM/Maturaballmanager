import AVFoundation
import Combine
import Foundation
import CryptoKit

class QRCodeScannerViewModel: NSObject, ObservableObject {
    @Published var scannedData: String?
    @Published var isSignatureValid: Bool = false
    var captureSession: AVCaptureSession?

    override init() {
        super.init()
        self.setupCaptureSession()
    }

    private func setupCaptureSession() {
        captureSession = AVCaptureSession()
        
        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video),
              let videoInput = try? AVCaptureDeviceInput(device: videoCaptureDevice),
              captureSession?.canAddInput(videoInput) ?? false else {
            return
        }
        
        captureSession?.addInput(videoInput)
        
        let metadataOutput = AVCaptureMetadataOutput()
        
        if captureSession?.canAddOutput(metadataOutput) ?? false {
            captureSession?.addOutput(metadataOutput)
            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr]
        } else {
            return
        }
    }
    
    func processScannedQRCodeData(_ scannedData: String) {
            guard let data = Data(base64Encoded: scannedData) else {
                print("Error decoding base64 data")
                return
            }
            
            do {
                let decodedSummary = try JSONDecoder().decode(TicketDataDTO.self, from: data)
                print("Decoded TicketDataDTO: \(decodedSummary)")
                
                guard let publicKey = loadPublicKey() else {
                    print("Failed to load public key")
                    return
                }
                
                let verificationResult = verifySignature(publicKey: publicKey, content: decodedSummary.content, signature: decodedSummary.signature)
                print("Signature Verification Result: \(verificationResult ? "Valid" : "Invalid")")
                
                self.isSignatureValid = verificationResult
            } catch {
                print("Error decoding JSON data: \(error)")
            }
        }

        private func verifySignature(publicKey: P256.Signing.PublicKey, content: String, signature: String) -> Bool {
            guard let signatureData = Data(base64Encoded: signature),
                  let signature = try? P256.Signing.ECDSASignature(derRepresentation: signatureData),
                  let jsonData = content.data(using: .utf8) else {
                print("Failed to prepare data for verification")
                return false
            }

            return publicKey.isValidSignature(signature, for: jsonData)
        }

    private func loadPublicKey() -> P256.Signing.PublicKey? {
        guard let url = Bundle.main.url(forResource: "public", withExtension: "key"),
              let keyString = try? String(contentsOf: url),
              let publicKey = try? P256.Signing.PublicKey(pemRepresentation: keyString) else {
            print("Failed to load or find the public key")
            return nil
        }
        return publicKey
    }
    
    func startScanning() {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            self?.captureSession?.startRunning()
        }
    }

    func stopScanning() {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            self?.captureSession?.stopRunning()
        }
    }
}

extension QRCodeScannerViewModel: AVCaptureMetadataOutputObjectsDelegate {
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        guard let metadataObject = metadataObjects.first as? AVMetadataMachineReadableCodeObject,
              let stringValue = metadataObject.stringValue else {
            return
        }
        processScannedQRCodeData(stringValue)
    }
}
