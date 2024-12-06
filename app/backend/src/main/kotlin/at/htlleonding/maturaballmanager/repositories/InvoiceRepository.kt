package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Invoice
import io.quarkus.hibernate.reactive.panache.PanacheRepository
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import java.util.*

@ApplicationScoped
class InvoiceRepository : PanacheRepository<Invoice> {

    fun deleteById(id: UUID): Uni<Boolean> {
        return delete("id", id).map { it > 0 }
    }

    fun existsByInvoiceNumber(invoiceNumber: String): Uni<Boolean> {
        return find("invoiceNumber", invoiceNumber).count().map { it > 0 }
    }
}
