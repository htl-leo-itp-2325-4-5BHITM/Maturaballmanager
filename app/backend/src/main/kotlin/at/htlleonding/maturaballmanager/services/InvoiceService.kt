package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.Status
import at.htlleonding.maturaballmanager.model.entities.Invoice
import at.htlleonding.maturaballmanager.repositories.InvoiceRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import jakarta.ws.rs.NotFoundException
import org.eclipse.microprofile.jwt.JsonWebToken
import java.security.SecureRandom
import java.time.OffsetDateTime
import java.util.UUID

@ApplicationScoped
class InvoiceService {

    @Inject
    lateinit var invoiceRepository: InvoiceRepository

    @Inject
    lateinit var pdfGeneratorService: PdfGeneratorService

    @Inject
    lateinit var emailService: EmailService

    @Inject
    lateinit var jwt: JsonWebToken // Inject JWT

    /**
     * Erstellt eine neue Rechnung.
     */
    @Transactional
    fun createInvoice(invoice: Invoice): Invoice {
        if (invoice.invoiceDate == null) {
            invoice.invoiceDate = OffsetDateTime.now()
        }

        if (invoice.paymentDeadline == null) {
            invoice.paymentDeadline = invoice.invoiceDate?.plusDays(14)
        }

        // Generiere die 16-stellige Rechnungsnummer
        invoice.invoiceNumber = generateUniqueInvoiceNumber()

        // Berechne den Gesamtbetrag basierend auf den Benefits
        invoice.totalAmount = invoice.benefits.sumOf { it.price ?: 0.0 }

        invoice.status = if (invoice.status == Status.SENT) Status.SENT else Status.DRAFT

        invoiceRepository.persist(invoice)
        return invoice
    }

    /**
     * Aktualisiert eine bestehende Rechnung.
     */
    @Transactional
    fun updateInvoice(id: UUID, updatedInvoice: Invoice): Invoice {
        val existing = findInvoice(id)

        existing.company = updatedInvoice.company
        existing.contactPerson = updatedInvoice.contactPerson
        existing.benefits = updatedInvoice.benefits
        existing.invoiceDate = updatedInvoice.invoiceDate

        existing.paymentDeadline = updatedInvoice.paymentDeadline ?: existing.invoiceDate?.plusDays(14)

        existing.status = updatedInvoice.status

        existing.totalAmount = existing.benefits.sumOf { it.price ?: 0.0 }

        invoiceRepository.persist(existing)
        return existing
    }

    /**
     * Generiert eine eindeutige 16-stellige Rechnungsnummer.
     */
    private fun generateUniqueInvoiceNumber(): String {
        val random = SecureRandom()
        var invoiceNumber: String
        do {
            invoiceNumber = (1..16)
                .map { random.nextInt(10) }
                .joinToString("")
        } while (invoiceRepository.existsByInvoiceNumber(invoiceNumber))
        return invoiceNumber
    }

    /**
     * Löscht eine Rechnung anhand der ID.
     */
    fun deleteInvoice(id: UUID): Boolean {
        return invoiceRepository.deleteById(id)
    }

    /**
     * Findet alle Rechnungen.
     */
    fun findAllInvoices(): List<Invoice> {
        return invoiceRepository.listAll()
    }

    /**
     * Findet eine Rechnung anhand der ID.
     */
    fun findInvoice(id: UUID): Invoice {
        return invoiceRepository.find("id", id).singleResult() ?: throw NotFoundException("Rechnung nicht gefunden")
    }

    /**
     * Sendet eine Rechnung per E-Mail.
     */
    @Transactional
    fun sendInvoiceByEmail(id: UUID) {
        val invoice = findInvoice(id)
        emailService.sendInvoiceEmail(invoice)
        invoice.status = Status.SENT
        invoiceRepository.persist(invoice)
    }

    /**
     * Generiert ein PDF für die gegebene Rechnung.
     */
    fun generateInvoicePdf(invoice: Invoice): ByteArray {
        val firstName = jwt.claim<String>("given_name").orElse("Unbekannt")
        val lastName = jwt.claim<String>("family_name").orElse("")
        val senderName = "$firstName $lastName"

        return pdfGeneratorService.generateInvoicePdf(invoice, senderName)
    }
}
