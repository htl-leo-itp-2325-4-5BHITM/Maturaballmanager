import SwiftUI
import AVFoundation

struct QRCodeScannerView: UIViewControllerRepresentable {
    class Coordinator: NSObject, AVCaptureMetadataOutputObjectsDelegate {
        var parent: QRCodeScannerView
        var captureSession: AVCaptureSession?

        init(parent: QRCodeScannerView) {
            self.parent = parent
        }

        func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
            if let metadataObject = metadataObjects.first {
                guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
                guard let stringValue = readableObject.stringValue else { return }
                AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
                parent.didFindCode(stringValue)
            }
        }
    }

    var didFindCode: (String) -> Void
    @Binding var isScanning: Bool

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> UIViewController {
        let viewController = UIViewController()
        let captureSession = AVCaptureSession()
        context.coordinator.captureSession = captureSession

        DispatchQueue.global(qos: .userInitiated).async {
            guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else {
                print("No video capture device available")
                return
            }

            let videoInput: AVCaptureDeviceInput
            do {
                videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
            } catch {
                print("Error creating video input: \(error)")
                return
            }

            if captureSession.canAddInput(videoInput) {
                captureSession.addInput(videoInput)
            } else {
                print("Cannot add video input to capture session")
                return
            }

            let metadataOutput = AVCaptureMetadataOutput()
            if captureSession.canAddOutput(metadataOutput) {
                captureSession.addOutput(metadataOutput)
                metadataOutput.setMetadataObjectsDelegate(context.coordinator, queue: DispatchQueue.main)
                metadataOutput.metadataObjectTypes = [.qr]
            } else {
                print("Cannot add metadata output to capture session")
                return
            }

            DispatchQueue.main.async {
                let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                previewLayer.frame = viewController.view.layer.bounds
                previewLayer.videoGravity = .resizeAspectFill
                viewController.view.layer.addSublayer(previewLayer)
            }

            if self.isScanning {
                captureSession.startRunning()
            }
        }

        return viewController
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        if let session = context.coordinator.captureSession {
            if isScanning {
                if !session.isRunning {
                    session.startRunning()
                }
            } else {
                if session.isRunning {
                    session.stopRunning()
                }
            }
        }
    }
}
