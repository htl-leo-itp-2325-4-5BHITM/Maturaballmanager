package at.htlleonding.maturaballmanager.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import jakarta.enterprise.context.ApplicationScoped;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.EnumMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@ApplicationScoped
public class QrService {
    private static final Logger LOGGER = Logger.getLogger(QrService.class.getName());
    private static final int WIDTH = 300;
    private static final int HEIGHT = 300;

    private PrivateKey loadPrivateKey() {
        try (InputStream keyStream = getClass().getResourceAsStream("/private_key.pem")) {
            if (keyStream == null) {
                LOGGER.severe("private_key.pem file not found");
                return null;
            }
            byte[] keyBytes = keyStream.readAllBytes();
            String privateKeyPEM = new String(keyBytes, StandardCharsets.UTF_8);
            privateKeyPEM = privateKeyPEM
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");

            byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(spec);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error reading private_key.pem file: {0}", e.getMessage());
            return null;
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            LOGGER.log(Level.SEVERE, "Error generating private key: {0}", e.getMessage());
            return null;
        }
    }

    public String signData(String data) {
        try {
            PrivateKey privateKey = loadPrivateKey();
            if (privateKey == null) {
                LOGGER.severe("Private key is null");
                return null;
            }
            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initSign(privateKey);
            signature.update(data.getBytes(StandardCharsets.UTF_8));
            byte[] signedData = signature.sign();
            return Base64.getEncoder().encodeToString(signedData);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error signing data: {0}", e.getMessage());
            return null;
        }
    }

    public byte[] createQRCode(String jsonData) {
        return createQRCode(jsonData, ErrorCorrectionLevel.M);
    }

    public byte[] createQRCode(String jsonData, ErrorCorrectionLevel errorCorrectionLevel) {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix;
        try {
            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.ERROR_CORRECTION, errorCorrectionLevel);

            bitMatrix = qrCodeWriter.encode(jsonData, BarcodeFormat.QR_CODE, WIDTH, HEIGHT, hints);
        } catch (WriterException e) {
            LOGGER.log(Level.SEVERE, "Error creating QR code: {0}", e.getMessage());
            throw new RuntimeException(e);
        }

        BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
        for (int i = 0; i < WIDTH; i++) {
            for (int j = 0; j < HEIGHT; j++) {
                image.setRGB(i, j, (bitMatrix.get(i, j) ? 0xFF000000 : 0xFFFFFFFF));
            }
        }

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        try {
            ImageIO.write(image, "PNG", pngOutputStream);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error writing QR code to output stream: {0}", e.getMessage());
            throw new RuntimeException(e);
        }
        return pngOutputStream.toByteArray();
    }
}
