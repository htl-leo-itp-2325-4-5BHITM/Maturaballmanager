package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.quarkus.panache.common.Sort
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.EntityNotFoundException

@ApplicationScoped
class ContactPersonRepository : PanacheRepositoryBase<ContactPerson, String> {

    @Inject
    lateinit var invoiceRepository: InvoiceRepository

    /**
     * Retrieves all contact persons for a specific company.
     */
    fun getByCompanyId(companyId: String): Uni<List<ContactPerson>> {
        return find("company.id = ?1", Sort.by("lastName", "firstName", "position"), companyId)
            .list()
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

    @WithTransaction
    override fun deleteById(contactPersonId: String): Uni<Boolean> {
        return invoiceRepository.findByContactPersonId(contactPersonId)
            .flatMap { invoices ->
                if (invoices.isNotEmpty()) {
                    Uni.createFrom().failure(
                        IllegalStateException("Cannot delete contact person; it is referenced by one or more invoices.")
                    )
                } else {
                    super.deleteById(contactPersonId)
                }
            }
    }
}
