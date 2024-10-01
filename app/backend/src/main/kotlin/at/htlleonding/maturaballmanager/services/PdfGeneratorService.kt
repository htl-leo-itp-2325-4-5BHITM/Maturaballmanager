package at.htlleonding.maturaballmanager.service

import at.htlleonding.maturaballmanager.model.entities.Invoice
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.font.PDType1Font
import jakarta.enterprise.context.ApplicationScoped
import org.apache.pdfbox.pdmodel.font.PDType0Font
import org.apache.pdfbox.pdmodel.font.Standard14Fonts
import java.io.ByteArrayOutputStream

@ApplicationScoped
class PdfGeneratorService {

    /**
     * Generates a PDF for the given invoice using Apache PDFBox.
     *
     * @param invoice The invoice entity.
     * @return A byte array representing the PDF.
     */
    fun generateInvoicePdf(invoice: Invoice): ByteArray {
        PDDocument().use { document ->
            val page = PDPage(PDRectangle.LETTER)
            document.addPage(page)

            PDPageContentStream(document, page).use { contentStream ->
                contentStream.beginText()
                contentStream.newLineAtOffset(50f, 700f)
                contentStream.showText("Invoice")
                contentStream.endText()

                // Company Information
                contentStream.beginText()
                contentStream.newLineAtOffset(50f, 680f)
                contentStream.showText("Company: ${invoice.company?.name}")
                contentStream.newLineAtOffset(0f, -15f)
                contentStream.showText("Address: ${invoice.company?.address}")
                contentStream.endText()

                // Contact Person
                invoice.contactPerson?.let { cp ->
                    contentStream.beginText()
                    contentStream.newLineAtOffset(50f, 650f)
                    contentStream.showText("Contact Person: ${cp.first_name} ${cp.last_name}")
                    contentStream.newLineAtOffset(0f, -15f)
                    contentStream.showText("Email: ${cp.personal_email}")
                    contentStream.endText()
                }

                // Invoice Details
                contentStream.beginText()
                contentStream.newLineAtOffset(50f, if (invoice.contactPerson != null) 620f else 650f)
                contentStream.showText("Invoice Date: ${invoice.invoiceDate}")
                contentStream.newLineAtOffset(0f, -15f)
                contentStream.showText("Payment Deadline: ${invoice.paymentDeadline}")
                contentStream.endText()

                // Table Headers
                contentStream.beginText()
                contentStream.newLineAtOffset(50f, 580f)
                contentStream.showText("Benefit")
                contentStream.newLineAtOffset(200f, 0f)
                contentStream.showText("Description")
                contentStream.newLineAtOffset(200f, 0f)
                contentStream.showText("Price (€)")
                contentStream.endText()

                // Table Content
                var yPosition = 560f
                invoice.benefits.forEach { benefit ->
                    contentStream.beginText()
                    contentStream.newLineAtOffset(50f, yPosition)
                    contentStream.showText(benefit.name ?: "")
                    contentStream.newLineAtOffset(200f, 0f)
                    contentStream.showText(benefit.description ?: "")
                    contentStream.newLineAtOffset(200f, 0f)
                    contentStream.showText(String.format("%.2f", benefit.price ?: 0.0))
                    contentStream.endText()
                    yPosition -= 20f
                }

                // Total Amount
                contentStream.beginText()
                contentStream.newLineAtOffset(50f, yPosition - 20f)
                contentStream.showText("Total Amount: ${String.format("%.2f", invoice.totalAmount)} €")
                contentStream.endText()
            }

            // Save to ByteArrayOutputStream
            val baos = ByteArrayOutputStream()
            document.save(baos)
            return baos.toByteArray()
        }
    }
}