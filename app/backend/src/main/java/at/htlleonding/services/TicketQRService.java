package at.htlleonding.services;

import at.htlleonding.model.dto.tickets.TicketQRCodeDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import jakarta.enterprise.context.ApplicationScoped;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

@ApplicationScoped
public class TicketQRService {
    private static final String ISSUER = "HTL Leonding";
    private static final int QR_CODE_SIZE = 200;

    private static final Map<EncodeHintType, Object> QR_CODE_HINTS = new HashMap<>() {{
        put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        put(EncodeHintType.CHARACTER_SET, "UTF-8");
    }};

    public byte[] generateSignedQRCode(String data) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        TicketQRCodeDTO dto = new TicketQRCodeDTO(data, ISSUER);
        String jsonData = mapper.writeValueAsString(dto);

        Signature signature = Signature.getInstance("SHA256withRSA");
        PrivateKey privateKey = loadPrivateKey();
        signature.initSign(privateKey);
        signature.update(jsonData.getBytes());
        byte[] digitalSignature = signature.sign();

        TicketQRCodeDTO signedDto = new TicketQRCodeDTO(jsonData, Base64.getEncoder().encodeToString(digitalSignature));

        String signedJsonData = mapper.writeValueAsString(signedDto);
        byte[] compressedData = compressData(signedJsonData);

        MultiFormatWriter qrCodeWriter = new MultiFormatWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(Base64.getEncoder().encodeToString(compressedData), BarcodeFormat.QR_CODE ,QR_CODE_SIZE, QR_CODE_SIZE, QR_CODE_HINTS);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

    private byte[] compressData(String data) throws Exception {
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream(data.length());
        try (GZIPOutputStream zipStream = new GZIPOutputStream(byteStream)) {
            zipStream.write(data.getBytes());
        }
        return byteStream.toByteArray();
    }

    private PrivateKey loadPrivateKey() throws Exception {
        InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("private.key");
        if (is == null) {
            throw new RuntimeException("Private key file not found in resources.");
        }
        byte[] keyBytes = is.readAllBytes();
        is.close();

        String privateKeyPEM = new String(keyBytes).replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "").replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }
}
