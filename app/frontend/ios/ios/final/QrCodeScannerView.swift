import SwiftUI
import AVFoundation

struct QRCodeScannerView: UIViewControllerRepresentable {
    class Coordinator: NSObject, AVCaptureMetadataOutputObjectsDelegate {
        var parent: QRCodeScannerView

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

        DispatchQueue.global(qos: .userInitiated).async {
            guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { return }
            let videoInput: AVCaptureDeviceInput

            do {
                videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
            } catch {
                return
            }

            captureSession.beginConfiguration()

            if (captureSession.canAddInput(videoInput)) {
                captureSession.addInput(videoInput)
            } else {
                return
            }

            let metadataOutput = AVCaptureMetadataOutput()

            if (captureSession.canAddOutput(metadataOutput)) {
                captureSession.addOutput(metadataOutput)

                metadataOutput.setMetadataObjectsDelegate(context.coordinator, queue: DispatchQueue.main)
                metadataOutput.metadataObjectTypes = [.qr]
            } else {
                return
            }

            captureSession.commitConfiguration()

            DispatchQueue.main.async {
                let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                previewLayer.frame = viewController.view.layer.bounds
                previewLayer.videoGravity = .resizeAspectFill
                viewController.view.layer.addSublayer(previewLayer)
            }

            if self.isScanning {
                captureSession.startRunning()
            }

            context.coordinator.captureSession = captureSession
        }

        return viewController
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        if let session = context.coordinator.captureSession {
            if isScanning {
                if !session.isRunning {
                    DispatchQueue.global(qos: .userInitiated).async {
                        session.startRunning()
                    }
                }
            } else {
                if session.isRunning {
                    DispatchQueue.global(qos: .userInitiated).async {
                        session.stopRunning()
                    }
                }
            }
        }
    }
}

extension QRCodeScannerView.Coordinator {
    var captureSession: AVCaptureSession? {
        get { objc_getAssociatedObject(self, &QRCodeScannerView.Coordinator.captureSessionKey) as? AVCaptureSession }
        set { objc_setAssociatedObject(self, &QRCodeScannerView.Coordinator.captureSessionKey, newValue, .OBJC_ASSOCIATION_RETAIN_NONATOMIC) }
    }

    private static var captureSessionKey: UInt8 = 0
}
