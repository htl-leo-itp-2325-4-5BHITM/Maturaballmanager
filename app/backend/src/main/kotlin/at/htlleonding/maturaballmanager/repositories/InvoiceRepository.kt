package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Invoice
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

@ApplicationScoped
class InvoiceRepository : PanacheRepository<Invoice> {

    fun deleteById(id: UUID): Boolean {
        delete("id", id)
        return true
    }

    fun existsByInvoiceNumber(invoiceNumber: String): Boolean {
        return count("invoiceNumber", invoiceNumber) > 0
    }
}
