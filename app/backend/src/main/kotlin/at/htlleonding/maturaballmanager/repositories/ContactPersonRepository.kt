// ContactPersonRepository.kt

package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.transaction.Transactional

@ApplicationScoped
class ContactPersonRepository {

    @PersistenceContext
    lateinit var em: EntityManager

    @Transactional
    fun create(contactPerson: ContactPerson): ContactPerson {
        em.persist(contactPerson)
        return contactPerson
    }

    fun getById(id: String): ContactPerson? {
        return em.find(ContactPerson::class.java, id)
    }

    @Transactional
    fun update(contactPerson: ContactPerson): ContactPerson {
        return em.merge(contactPerson)
    }

    @Transactional
    fun delete(id: String) {
        val contactPerson = getById(id)
        if (contactPerson != null) {
            em.remove(contactPerson)
        }
    }
}
