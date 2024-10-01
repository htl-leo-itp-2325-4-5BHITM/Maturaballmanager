package at.htlleonding.maturaballmanager.service

import at.htlleonding.maturaballmanager.model.entities.Invoice
import io.quarkus.qute.Template
import io.quarkus.mailer.Mail
import io.quarkus.mailer.Mailer
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class EmailService {

    @Inject
    lateinit var mailer: Mailer

    @Inject
    lateinit var invoiceEmail: Template

    /**
     * Sends an invoice email with the provided PDF attachment.
     *
     * @param invoice The invoice entity.
     * @param pdfBytes The PDF content as a byte array.
     */
    fun sendInvoiceEmail(invoice: Invoice, pdfBytes: ByteArray) {
        // Prepare email content using Qute template
        val emailContent: String = invoiceEmail
            .data("invoice", invoice)
            .render()

        // Determine recipient
        val recipient = invoice.contactPerson?.personal_email
            ?: invoice.company?.office_email
            ?: throw IllegalArgumentException("No valid email address found for the recipient")

        // Define email subject
        val subject = "Your Invoice #${invoice.id}"

        // Create and send email
        val mail = Mail.withHtml(recipient, subject, emailContent)
            .addAttachment("Invoice_${invoice.id}.pdf", pdfBytes, "application/pdf")

        mailer.send(mail)
    }
}