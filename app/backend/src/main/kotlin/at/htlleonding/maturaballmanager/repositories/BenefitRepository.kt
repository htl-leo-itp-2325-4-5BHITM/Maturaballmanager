package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Benefit
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityNotFoundException

@ApplicationScoped
class BenefitRepository : PanacheRepositoryBase<Benefit, String> {

    /**
     * Retrieves all benefits.
     */
    fun getAll(): Uni<List<Benefit>> {
        return listAll()
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
        return persist(benefit).flatMap(Uni.createFrom()::item)
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
    fun delete(id: String): Uni<Void?>? {
        return delete("id", id)
            .onItem().ifNotNull().transform { null as Void? } // Transform successful deletion into Void
            .onFailure().transform { throwable ->
                if (throwable.message?.contains("violates foreign key constraint") == true) {
                    IllegalStateException(
                        "Cannot delete benefit with ID $id because it is referenced in other records.",
                        throwable
                    )
                } else {
                    throwable
                }
            }
    }

    fun findAllByIds(ids: List<String>): Uni<List<Benefit>> {
        return find("id in (?1)", ids).list()
    }
}