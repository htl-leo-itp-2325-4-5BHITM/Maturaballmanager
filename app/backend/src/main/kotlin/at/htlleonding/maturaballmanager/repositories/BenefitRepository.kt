package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.Benefit
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.transaction.Transactional
import jakarta.persistence.EntityNotFoundException

@ApplicationScoped
class BenefitRepository {

    @PersistenceContext
    lateinit var em: EntityManager

    fun getAll(): List<Benefit> {
        return em.createQuery("SELECT b FROM Benefit b", Benefit::class.java).resultList
    }

    fun getById(id: String): Benefit? {
        return em.find(Benefit::class.java, id)
    }

    @Transactional
    fun create(benefit: Benefit): Benefit {
        em.persist(benefit)
        return benefit
    }

    @Transactional
    fun update(benefit: Benefit): Benefit {
        val existingBenefit = getById(benefit.id!!) ?: throw EntityNotFoundException("Benefit not found")
        existingBenefit.name = benefit.name
        existingBenefit.description = benefit.description
        existingBenefit.price = benefit.price
        return benefit
    }

    @Transactional
    fun delete(id: String) {
        val benefit = getById(id)
        if (benefit != null) {
            em.remove(benefit)
        } else {
            throw EntityNotFoundException("Benefit not found")
        }
    }
}
