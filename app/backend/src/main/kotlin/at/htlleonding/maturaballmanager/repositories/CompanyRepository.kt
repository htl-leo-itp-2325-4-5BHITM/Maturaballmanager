// src/main/kotlin/at/htlleonding/maturaballmanager/repositories/CompanyRepository.kt
package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Company
import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityManager
import jakarta.persistence.EntityNotFoundException
import jakarta.persistence.PersistenceContext
import jakarta.transaction.Transactional

@ApplicationScoped
class CompanyRepository {

    @PersistenceContext
    lateinit var em: EntityManager

    fun getAll(): List<Company> {
        return em.createQuery(
            "SELECT DISTINCT c FROM Company c LEFT JOIN FETCH c.contact_persons",
            Company::class.java
        ).resultList
    }

    fun getById(id: String): Company? {
        return try {
            em.createQuery(
                "SELECT c FROM Company c LEFT JOIN FETCH c.contact_persons WHERE c.id = :id",
                Company::class.java
            )
                .setParameter("id", id)
                .singleResult
        } catch (e: Exception) {
            null
        }
    }

    @Transactional
    fun create(company: Company): Company {
        company.contact_persons.forEach { it.company_id = company }
        em.persist(company)
        return company
    }

    @Transactional
    fun update(company: Company): Company {
        val existingCompany = getById(company.id!!) ?: throw EntityNotFoundException("Company not found")

        existingCompany.name = company.name
        existingCompany.industry = company.industry
        existingCompany.website = company.website
        existingCompany.office_email = company.office_email
        existingCompany.office_phone = company.office_phone
        existingCompany.address = company.address

        existingCompany.contact_persons.forEach { em.remove(it) }
        existingCompany.contact_persons = company.contact_persons
        return existingCompany
    }

    @Transactional
    fun delete(id: String) {
        val company = getById(id)
        if (company != null) {
            em.remove(company)
        }
    }

    fun getContactPersons(id: String): List<ContactPerson> {
        val company = getById(id) ?: throw EntityNotFoundException("Company not found")
        return em.createQuery(
            "SELECT cp FROM ContactPerson cp WHERE cp.company_id = :company",
            ContactPerson::class.java
        )
            .setParameter("company", company)
            .resultList
    }

    fun getAllCompanies(): List<Company> {
        return em.createQuery("SELECT c FROM Company c", Company::class.java).resultList
    }
}