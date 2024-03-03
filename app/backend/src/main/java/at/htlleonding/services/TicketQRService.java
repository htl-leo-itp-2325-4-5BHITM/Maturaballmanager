package at.htlleonding.services;

import at.htlleonding.model.dto.tickets.TicketQRCodeDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@ApplicationScoped
public class TicketQRService {
    private static final String ISSUER = "HTL Leonding";
    public byte[] generateSignedQRCode(String data) throws Exception {
        TicketQRCodeDTO dto = new TicketQRCodeDTO(data, ISSUER);
        ObjectMapper mapper = new ObjectMapper();
        String content = mapper.writeValueAsString(dto);

        Signature signature = Signature.getInstance("SHA256withRSA");
        PrivateKey privKey = loadPrivateKey();

        signature.initSign(privKey);
        signature.update(content.getBytes());
        byte[] digitalSignature = signature.sign();

        TicketQRCodeDTO signedContentDTO = new TicketQRCodeDTO(content, Base64.getEncoder().encodeToString(digitalSignature));
        String signedContentJson = mapper.writeValueAsString(signedContentDTO);

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(signedContentJson, BarcodeFormat.QR_CODE, 200, 200);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

        return pngOutputStream.toByteArray();
    }

    private PrivateKey loadPrivateKey() throws Exception {
        InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("private.key");
        if (is == null) {
            throw new RuntimeException("Private key file not found in resources.");
        }
        byte[] keyBytes = is.readAllBytes();
        is.close();

        String privateKeyPEM = new String(keyBytes);
        privateKeyPEM = privateKeyPEM.replace("-----BEGIN PRIVATE KEY-----", "");
        privateKeyPEM = privateKeyPEM.replace("-----END PRIVATE KEY-----", "");
        privateKeyPEM = privateKeyPEM.replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }
}