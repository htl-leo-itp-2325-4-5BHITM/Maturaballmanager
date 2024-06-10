package at.htlleonding.maturaballmanager.repository;

import at.htlleonding.maturaballmanager.entity.FAQItem;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class FAQRepository {

    @Inject
    EntityManager em;

    public List<FAQItem> get() {
        return em.createQuery("SELECT f FROM FAQItem f ORDER BY f.priority DESC", FAQItem.class).getResultList();
    }
}
