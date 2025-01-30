package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.InvoicePdfModel
import at.htlleonding.maturaballmanager.model.entities.Invoice
import io.quarkus.mailer.Mail
import io.quarkus.mailer.reactive.ReactiveMailer
import io.quarkus.qute.Template
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import java.io.InputStream
import java.time.LocalDate
import org.eclipse.microprofile.jwt.JsonWebToken
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import io.smallrye.mutiny.Uni
import java.io.File

@ApplicationScoped
class EmailService {

    private val logger: Logger = LoggerFactory.getLogger(EmailService::class.java)

    @Inject
    lateinit var mailer: ReactiveMailer

    @Inject
    @Named("invoiceEmail")
    lateinit var invoiceEmail: Template

    @Inject
    lateinit var invoiceService: InvoiceService

    @Inject
    lateinit var pdfGeneratorService: PdfGeneratorService

    @Inject
    lateinit var jwt: JsonWebToken

    /**
     * Sends an invoice email with an attached PDF and inline logo.
     */
    fun sendInvoiceEmail(invoice: Invoice, email: String): Uni<Void> {
        val currentYear = LocalDate.now().year

        val firstName = jwt.getClaim<String>("given_name") ?: "Unbekannt"
        val lastName = jwt.getClaim<String>("family_name") ?: ""

        val senderName = "$firstName $lastName"

        val emailContent: String = invoiceEmail
            .data("invoice", invoice)
            .data("currentYear", currentYear)
            .data("senderName", senderName)
            .render()

        val model = invoiceService.createInvoicePdfModel(invoice)

        return pdfGeneratorService.generateInvoicePdf(model, senderName,false)
            .flatMap { pdfBytes ->
                val recipient = email

                logger.info("Sending invoice to: $recipient")

                val subject = "Ihre Rechnung #${invoice.id}"

                val logoBytes: ByteArray = loadLogo("img/htllogo_2022_black_v2-2.png")
                    ?: throw IllegalStateException("Failed to load logo")

                val mail = Mail.withHtml(recipient, subject, emailContent)
                    .addAttachment("logo.png", logoBytes, "image/png", "logo", "inline")
                    .addAttachment("Invoice_${invoice.id}.pdf", pdfBytes, "application/pdf")

                mailer.send(mail)
            }
            .onFailure().invoke { err: Throwable ->
                logger.error("Failed to send invoice email: ${err.message}", err)
            }
    }


    /**
     * Loads the logo from the classpath.
     */
    private fun loadLogo(path: String): ByteArray? {
        val logoStream: InputStream? = Thread.currentThread().contextClassLoader.getResourceAsStream(path)
        return logoStream?.use { it.readBytes() }
    }
}
