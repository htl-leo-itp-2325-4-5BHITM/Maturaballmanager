package at.htlleonding.maturaballmanager.repository

import at.htlleonding.maturaballmanager.model.entities.Invoice
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class InvoiceRepository : PanacheRepository<Invoice> {

    fun deleteById(id: String): Boolean {
        delete("id", id)
        return true
    }
}
