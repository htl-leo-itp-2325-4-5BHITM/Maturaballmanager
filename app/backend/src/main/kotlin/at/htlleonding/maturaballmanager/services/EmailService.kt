package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.entities.Invoice
import io.quarkus.mailer.Mail
import io.quarkus.mailer.Mailer
import io.quarkus.qute.Template
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import java.io.InputStream
import java.time.LocalDate
import org.eclipse.microprofile.jwt.JsonWebToken

@ApplicationScoped
class EmailService {

    @Inject
    lateinit var mailer: Mailer

    @Inject
    @Named("invoiceEmail")
    lateinit var invoiceEmail: Template

    @Inject
    lateinit var pdfGeneratorService: PdfGeneratorService

    @Inject
    lateinit var jwt: JsonWebToken

    fun sendInvoiceEmail(invoice: Invoice) {
        val currentYear = LocalDate.now().year

        // Vor- und Nachnamen aus JWT-Token extrahieren
        val firstName = jwt.claim<String>("given_name").orElse("Unbekannt")
        val lastName = jwt.claim<String>("family_name").orElse("")

        val senderName = "$firstName $lastName"

        // E-Mail-Inhalt aus der Vorlage rendern und den Sendernamen übergeben
        val emailContent: String = invoiceEmail
            .data("invoice", invoice)
            .data("currentYear", currentYear)
            .data("senderName", senderName)
            .render()

        // PDF generieren mit SenderName
        val pdfBytes = pdfGeneratorService.generateInvoicePdf(invoice, senderName)

        // Bestimme den Empfänger
        val recipient = invoice.contactPerson?.personalEmail
            ?: invoice.company?.officeEmail
            ?: throw IllegalArgumentException("Keine gültige E-Mail-Adresse für den Empfänger gefunden")
        println(recipient)

        val subject = "Ihre Rechnung #${invoice.invoiceNumber}"

        // Laden Sie das Logo als Base64 ein (optional, falls Sie es inline einfügen möchten)
        val logoStream: InputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("img/htllogo_2022_black_v2-2.png")
            ?: throw IllegalArgumentException("Logo nicht gefunden")
        val logoBytes = logoStream.readAllBytes()

        // Erstelle und sende die E-Mail
        val mail = Mail.withHtml(recipient, subject, emailContent)
            .addAttachment("Invoice_${invoice.invoiceNumber}.pdf", pdfBytes, "application/pdf")
            .addInlineAttachment("logo.png", logoBytes, "image/png", "school_logo")

        mailer.send(mail)
    }
}