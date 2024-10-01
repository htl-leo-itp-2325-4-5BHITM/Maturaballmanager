// src/main/kotlin/at/htlleonding/maturaballmanager/service/InvoiceService.kt

package at.htlleonding.maturaballmanager.service

import at.htlleonding.maturaballmanager.model.Status
import at.htlleonding.maturaballmanager.model.entities.Invoice
import at.htlleonding.maturaballmanager.repository.InvoiceRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import jakarta.ws.rs.NotFoundException

@ApplicationScoped
class InvoiceService {

    @Inject
    lateinit var invoiceRepository: InvoiceRepository

    @Inject
    lateinit var pdfGeneratorService: PdfGeneratorService

    @Inject
    lateinit var emailService: EmailService

    /**
     * Ruft alle Rechnungen ab.
     */
    fun findAllInvoices(): List<Invoice> {
        return invoiceRepository.findAll().list()
    }

    /**
     * Erstellt eine neue Rechnung.
     */
    @Transactional
    fun createInvoice(invoice: Invoice): Invoice {
        if (invoice.invoiceDate == null) {
            invoice.invoiceDate = java.time.LocalDate.now()
        }
        if (invoice.paymentDeadline == null) {
            invoice.paymentDeadline = invoice.invoiceDate?.plusDays(14)
        }

        // Berechne den Gesamtbetrag
        invoice.totalAmount = invoice.benefits.sumOf { it.price ?: 0.0 }

        invoice.status = if (invoice.status == Status.SENT) Status.SENT else Status.DRAFT

        invoiceRepository.persist(invoice)
        return invoice
    }

    /**
     * Findet eine Rechnung anhand der ID.
     */
    fun findInvoice(id: String): Invoice {
        return invoiceRepository.find("id", id).singleResult() ?: throw NotFoundException("Rechnung nicht gefunden")
    }

    /**
     * Aktualisiert eine bestehende Rechnung.
     */
    @Transactional
    fun updateInvoice(id: String, updatedInvoice: Invoice): Invoice {
        val existing = findInvoice(id)

        existing.company = updatedInvoice.company
        existing.contactPerson = updatedInvoice.contactPerson
        existing.benefits = updatedInvoice.benefits
        existing.invoiceDate = updatedInvoice.invoiceDate
        existing.paymentDeadline = updatedInvoice.paymentDeadline
        existing.status = updatedInvoice.status
        existing.totalAmount = updatedInvoice.benefits.sumOf { it.price ?: 0.0 }

        invoiceRepository.persist(existing)
        return existing
    }

    /**
     * Löscht eine Rechnung anhand der ID.
     */
    @Transactional
    fun deleteInvoice(id: String): Boolean {
        return invoiceRepository.deleteById(id)
    }

    /**
     * Sendet eine Rechnung per E-Mail.
     */
    @Transactional
    fun sendInvoiceByEmail(id: String) {
        val invoice = findInvoice(id)

        val pdfBytes = pdfGeneratorService.generateInvoicePdf(invoice)

        emailService.sendInvoiceEmail(invoice, pdfBytes)

        invoice.status = Status.SENT
        invoiceRepository.persist(invoice)
    }

    /**
     * Generiert ein PDF für die Rechnung.
     */
    fun generateInvoicePdf(invoice: Invoice): ByteArray {
        return pdfGeneratorService.generateInvoicePdf(invoice)
    }
}