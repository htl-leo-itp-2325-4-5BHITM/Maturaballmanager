package at.tommyneumaier.services;

import at.tommyneumaier.model.dto.TicketInformationDTO;
import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Objects;

@ApplicationScoped
public class QrService {

    private static final String PRIVATE_KEY_FILE_NAME = "private_key_decrypted.pem";

    public byte[] generateQRCodeImage(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

    public String sign(String plainText, PrivateKey privateKey) throws Exception {
        Signature privateSignature = Signature.getInstance("SHA256withRSA");
        privateSignature.initSign(privateKey);
        privateSignature.update(plainText.getBytes(StandardCharsets.UTF_8));
        byte[] signature = privateSignature.sign();
        return Base64.getEncoder().encodeToString(signature);
    }

    public byte[] createSignedQRCode(TicketInformationDTO ticketInformationDTO) throws Exception {
        PrivateKey privateKey = getPrivateKey();
        String ticketInfo = ticketInformationDTO.toString();
        String signedInfo = sign(ticketInfo, privateKey);
        return generateQRCodeImage(signedInfo, 350, 350);
    }

    private PrivateKey getPrivateKey() throws Exception {
        byte[] keyBytes = Objects.requireNonNull(Thread.currentThread().getContextClassLoader().getResourceAsStream(PRIVATE_KEY_FILE_NAME)).readAllBytes();

        String privateKeyContent = new String(keyBytes);
        privateKeyContent = privateKeyContent.replaceAll("\\n", "").replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");

        KeyFactory kf = KeyFactory.getInstance("RSA");

        PKCS8EncodedKeySpec keySpecPKCS8 = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyContent));
        return kf.generatePrivate(keySpecPKCS8);
    }
}