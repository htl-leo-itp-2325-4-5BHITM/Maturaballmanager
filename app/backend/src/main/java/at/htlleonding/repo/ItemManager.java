package at.htlleonding.repo;

import at.htlleonding.entities.ItemTemplate;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class ItemManager {

    @Inject
    EntityManager em;

    public List<ItemTemplate> getItemTemplates() {
        return em.createQuery("SELECT i FROM ItemTemplate i", ItemTemplate.class).getResultList();
    }
}
