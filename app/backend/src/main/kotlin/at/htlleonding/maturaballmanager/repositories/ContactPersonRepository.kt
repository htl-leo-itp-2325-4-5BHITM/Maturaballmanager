package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import io.smallrye.mutiny.Uni

@ApplicationScoped
class ContactPersonRepository : PanacheRepositoryBase<ContactPerson, String> {

    /**
     * Retrieves all contact persons for a specific company.
     */
    fun getByCompanyId(companyId: String): Uni<List<ContactPerson>> {
        return find("company.id", companyId).list()
    }

    /**
     * Retrieves a contact person by ID.
     */
    fun getById(id: String): Uni<ContactPerson?> {
        return findById(id)
    }

    /**
     * Creates a new contact person.
     */
    @WithTransaction
    fun create(contactPerson: ContactPerson): Uni<ContactPerson> {
        return persist(contactPerson)
    }

    /**
     * Updates an existing contact person.
     */
    @WithTransaction
    fun update(contactPerson: ContactPerson): Uni<ContactPerson> {
        return findById(contactPerson.id!!)
            .onItem().ifNull().failWith(EntityNotFoundException("ContactPerson not found"))
            .flatMap { existingContact ->
                existingContact.firstName = contactPerson.firstName
                existingContact.lastName = contactPerson.lastName
                existingContact.prefixTitle = contactPerson.prefixTitle
                existingContact.suffixTitle = contactPerson.suffixTitle
                existingContact.gender = contactPerson.gender
                existingContact.position = contactPerson.position
                existingContact.personalEmail = contactPerson.personalEmail
                existingContact.personalPhone = contactPerson.personalPhone
                existingContact.company = contactPerson.company
                persist(existingContact)
            }
    }

    /**
     * Deletes a contact person by ID.
     */
    @WithTransaction
    fun delete(id: String): Uni<Void> {
        return deleteById(id)
            .flatMap { deleted ->
                if (deleted) Uni.createFrom().voidItem()
                else Uni.createFrom().failure(EntityNotFoundException("ContactPerson not found"))
            }
    }
}
