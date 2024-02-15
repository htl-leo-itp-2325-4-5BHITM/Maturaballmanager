package at.htlleonding.services;

import at.htlleonding.model.dto.InvoiceDTO;
import com.itextpdf.html2pdf.HtmlConverter;
import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;

public class PDFService {

    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance billPDF(InvoiceDTO dto);
    }

    public void generatePDF(InvoiceDTO dto) {
        try {
            var text = Templates.billPDF(dto).render();
            HtmlConverter.convertToPdf(text, new FileOutputStream("bill.pdf"));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
