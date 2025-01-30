package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.InvoicePdfModel
import at.htlleonding.maturaballmanager.model.dtos.BankAccount
import com.itextpdf.html2pdf.HtmlConverter
import io.quarkus.qute.Template
import io.smallrye.mutiny.Uni
import io.smallrye.mutiny.infrastructure.Infrastructure
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.inject.Named
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.util.Base64

@ApplicationScoped
class PdfGeneratorService {

    @Inject
    @Named("invoicePdf")
    lateinit var invoicePdf: Template

    /**
     * Erzeugt das PDF im Worker-Thread (blockierend),
     * ohne dass wir weitere DB-Zugriffe ausführen müssen.
     */
    fun generateInvoicePdf(model: InvoicePdfModel, senderName: String, isCopy: Boolean): Uni<ByteArray> {
        return Uni.createFrom().item {
            val logoStream: InputStream = Thread.currentThread().contextClassLoader
                .getResourceAsStream("img/htllogo_2022_black_v2-2.png")
                ?: throw IllegalArgumentException("Logo nicht gefunden")
            val logoBytes = logoStream.use { it.readAllBytes() }
            val base64Logo = Base64.getEncoder().encodeToString(logoBytes)

            val bankAccount = BankAccount(
                iban = "AT55 2022 2023 2024 2025",
                bic = "ASPKAT2LXXX",
                bankName = "Sparkasse Oberösterreich",
                accountHolder = "Tommy Neumaier"
            )

            val htmlContent = invoicePdf
                .data("model", model)
                .data("base64Logo", base64Logo)
                .data("senderName", senderName)
                .data("senderStreet", "Limesstraße")
                .data("senderHouseNumber", "12-14a")
                .data("senderPostalCode", "4060")
                .data("senderCity", "Leonding")
                .data("bankAccount", bankAccount)
                .data("isCopy", isCopy)
                .render()

            val pdfStream = ByteArrayOutputStream()
            HtmlConverter.convertToPdf(
                ByteArrayInputStream(htmlContent.toByteArray()),
                pdfStream
            )
            pdfStream.toByteArray()
        }
            .runSubscriptionOn(Infrastructure.getDefaultWorkerPool())
    }
}