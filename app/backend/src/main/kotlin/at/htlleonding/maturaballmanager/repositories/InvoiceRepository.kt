package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.Status
import at.htlleonding.maturaballmanager.model.entities.Invoice
import at.htlleonding.maturaballmanager.model.entities.Prom
import io.quarkus.hibernate.reactive.panache.PanacheRepository
import io.quarkus.hibernate.reactive.panache.common.WithSession
import io.quarkus.panache.common.Sort
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import java.time.OffsetDateTime
import java.util.*

@ApplicationScoped
class InvoiceRepository : PanacheRepository<Invoice> {

    fun deleteById(id: UUID): Uni<Boolean> {
        return delete("id", id).map { it > 0 }
    }

    fun findAllByProm(prom: Prom): Uni<List<Invoice>> {
        return find("prom", prom).list()
    }

    fun findUnsentInvoices(): Uni<List<Invoice>> {
        return list("status", Status.DRAFT)
    }

    /**
     * Finds the newest invoice for the current year and increments
     * its 4-digit suffix. Example:
     *  - If latest ID is "20250042", next ID = "20250043"
     *  - If none exist, start = "20250001"
     *
     * Concurrency note: If two transactions do this in parallel,
     * you may see duplicates. Use a DB sequence or locking if concurrency is high.
     */
    @WithSession
    fun getNextManualInvoiceId(): Uni<String> {
        val currentYear = OffsetDateTime.now().year.toString()

        return find("id like ?1", sort("id", descending = true), "$currentYear%")
            .firstResult<Invoice>()
            .map { latestInvoiceOrNull ->
                val nextNumber = if (latestInvoiceOrNull == null) {
                    1
                } else {
                    val suffix = latestInvoiceOrNull.id!!.substring(4) // e.g. "0042"
                    suffix.toInt() + 1
                }

                val padded = String.format("%04d", nextNumber)
                "$currentYear$padded"
            }
    }

    private fun sort(field: String, descending: Boolean): Sort {
        return if (descending) Sort.by(field).descending() else Sort.by(field)
    }

    fun existsByInvoiceNumber(invoiceNumber: String): Uni<Boolean>? {
        return find("id", invoiceNumber).count().flatMap {
            if (it > 0) {
                Uni.createFrom().item(true)
            } else {
                Uni.createFrom().item(false)
            }
        }
    }

    fun findByContactPersonId(contactPersonId: String): Uni<List<Invoice>> {
        return list("contactPerson.id", contactPersonId)
    }

    fun findByBenefitId(benefitId: String): Uni<List<Invoice>> {
        return find("SELECT i FROM Invoice i JOIN i.benefits b WHERE b.id = ?1", benefitId).list()
    }
}
