package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Benefit
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.quarkus.panache.common.Sort
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityNotFoundException

@ApplicationScoped
class BenefitRepository : PanacheRepositoryBase<Benefit, String> {

    @Inject
    lateinit var promRepository: PromRepository

    @Inject
    lateinit var invoiceRepository: InvoiceRepository


    /**
     * Retrieves all benefits.
     */
    fun getAll(): Uni<List<Benefit>> {
        return promRepository.findLastActiveProm().flatMap { prom ->
            if (prom != null) {
                list("prom = ?1", Sort.by("name"), prom)
            } else {
                Uni.createFrom().item(emptyList())
            }
        }
    }


    /**
     * Retrieves a benefit by ID.
     */
    fun getById(id: String): Uni<Benefit?> {
        return findById(id)
    }

    /**
     * Creates a new benefit.
     */
    @WithTransaction
    fun create(benefit: Benefit): Uni<Benefit> {
        return promRepository.findLastActiveProm()
            .onItem().ifNull().failWith(IllegalStateException("No active Prom found"))
            .flatMap { activeProm ->
                benefit.prom = activeProm
                persist(benefit)
            }
    }

    /**
     * Updates an existing benefit.
     */
    @WithTransaction
    fun update(benefit: Benefit): Uni<Benefit> {
        return findById(benefit.id)
            .onItem().ifNull().failWith(EntityNotFoundException("Benefit not found"))
            .flatMap { existingBenefit ->
                existingBenefit.name = benefit.name
                existingBenefit.description = benefit.description
                existingBenefit.price = benefit.price
                persist(existingBenefit)
                    .replaceWith(existingBenefit)
            }
    }

    /**
     * Deletes a benefit by ID.
     */
    @WithTransaction
    fun delete(id: String): Uni<Void> {
        return isBenefitUsedInInvoice(id)
            .flatMap { used ->
                if (used) {
                    return@flatMap Uni.createFrom().failure(
                        jakarta.ws.rs.WebApplicationException("Benefit is still used in an invoice", 409)
                    )

                } else {
                    return@flatMap deleteById(id)
                        .flatMap { deleted ->
                            if (deleted) {
                                Uni.createFrom().voidItem()
                            } else {
                                Uni.createFrom().failure(EntityNotFoundException("Benefit not found"))
                            }
                        }
                }
            }
    }

    private fun isBenefitUsedInInvoice(benefitId: String): Uni<Boolean> {
        return invoiceRepository.findByBenefitId(benefitId)
            .map { invoices -> invoices.isNotEmpty() }
    }

    fun findAllByIds(ids: List<String>): Uni<List<Benefit>> {
        return find("id in (?1)", ids).list()
    }
}