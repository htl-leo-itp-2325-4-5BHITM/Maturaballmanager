package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.dtos.BankAccount
import at.htlleonding.maturaballmanager.model.entities.Invoice
import com.itextpdf.html2pdf.HtmlConverter
import io.quarkus.qute.Template
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

    fun generateInvoicePdf(invoice: Invoice, senderName: String): ByteArray {
        // Definieren Sie die Sender-Adresse
        val senderStreet = "Limesstraße"
        val senderHouseNumber = "12-14a"
        val senderPostalCode = "4060"
        val senderCity = "Leonding"

        // Laden des Logos und Umwandlung in Base64
        val logoStream: InputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("img/htllogo_2022_black_v2-2.png")
            ?: throw IllegalArgumentException("Logo nicht gefunden")
        val logoBytes = logoStream.readAllBytes()
        val base64Logo = Base64.getEncoder().encodeToString(logoBytes)

        // Rendern des HTML-Templates mit den Rechnungsdaten und dem Logo
        val bankAccount: BankAccount = BankAccount("AT55 2022 2023 2024 2025", "ASPKAT2LXXX", "Sparkasse Oberösterreich", "Tommy Neumaier")
        val htmlContent: String = invoicePdf
            .data("invoice", invoice)
            .data("base64Logo", base64Logo)
            .data("senderName", senderName)
            .data("senderStreet", senderStreet)
            .data("senderHouseNumber", senderHouseNumber)
            .data("senderPostalCode", senderPostalCode)
            .data("senderCity", senderCity)
            .data("bankAccount", bankAccount)
            .render()

        // Konvertierung des gerenderten HTML in PDF
        val pdfStream = ByteArrayOutputStream()
        HtmlConverter.convertToPdf(ByteArrayInputStream(htmlContent.toByteArray()), pdfStream)

        return pdfStream.toByteArray()
    }
}