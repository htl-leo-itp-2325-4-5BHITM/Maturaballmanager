package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Company
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityNotFoundException
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.smallrye.mutiny.Uni

@ApplicationScoped
class CompanyRepository : PanacheRepositoryBase<Company, String> {

    /**
     * Retrieves all companies with their contact persons.
     */
    fun getAll(): Uni<List<Company>> {
        return list("SELECT DISTINCT c FROM Company c LEFT JOIN FETCH c.contactPersons")
    }

    /**
     * Retrieves a company by ID with its contact persons.
     */
    fun getById(id: String): Uni<Company?> {
        return find("id", id).firstResult()
    }

    /**
     * Creates a new company.
     */
    @WithTransaction
    fun create(company: Company): Uni<Company> {
        company.contactPersons.forEach { it.company = company }
        return persist(company)
    }

    /**
     * Updates an existing company.
     */
    @WithTransaction
    fun update(company: Company): Uni<Company> {
        return findById(company.id!!)
            .onItem().ifNull().failWith(EntityNotFoundException("Company not found"))
            .flatMap { existingCompany ->
                existingCompany.name = company.name
                existingCompany.industry = company.industry
                existingCompany.website = company.website
                existingCompany.officeEmail = company.officeEmail
                existingCompany.officePhone = company.officePhone
                existingCompany.address = company.address

                existingCompany.contactPersons = company.contactPersons

                persist(existingCompany)
            }
    }

    /**
     * Deletes a company by ID.
     */
    @WithTransaction
    fun delete(id: String): Uni<Boolean> {
        return deleteById(id)
    }

    /**
     * Retrieves all companies.
     */
    fun getAllCompanies(): Uni<List<Company>> {
        return listAll()
    }
}