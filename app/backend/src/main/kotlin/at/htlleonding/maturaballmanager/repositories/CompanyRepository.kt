package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Company
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityNotFoundException
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import io.quarkus.hibernate.reactive.panache.common.WithSession
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.quarkus.panache.common.Sort
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject

@ApplicationScoped
class CompanyRepository : PanacheRepositoryBase<Company, String> {

    @Inject
    lateinit var promRepository: PromRepository

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
        return promRepository.findLastActiveProm()
            .onItem().ifNull().failWith(IllegalStateException("No active Prom found"))
            .flatMap { activeProm ->
                company.prom = activeProm
                persist(company)
            }
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
    @WithSession
    fun getAllCompanies(): Uni<List<Company>> {
        return promRepository.findLastActiveProm().flatMap { prom ->
            if (prom != null) {
                find("prom = ?1", Sort.by("name"), prom).list()
            } else {
                Uni.createFrom().item(emptyList())
            }
        }
    }

    /**
     * Sucht Unternehmen anhand eines Query-Strings im Namen oder der Branche.
     */
    fun searchCompanies(query: String): Uni<List<Company>> {
        if (query.isBlank()) {
            return getAllCompanies()
        }
        val lowerQuery = "%${query.lowercase()}%"
        return find("(lower(name) like ?1 OR lower(industry) like ?1)", lowerQuery).list()
    }
}