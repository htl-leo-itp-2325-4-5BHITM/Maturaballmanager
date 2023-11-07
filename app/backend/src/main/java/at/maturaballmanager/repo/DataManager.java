package at.maturaballmanager.repo;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DataManager {

    @Inject
    EntityManager em;

    @Transactional
    public void save(Object o) {
        em.persist(o);
    }

    public <T> T get(Class<T> clazz, Long id) {
        return em.find(clazz, id);
    }

    @Transactional
    public void delete(Object o) {
        em.remove(o);
    }

    @Transactional
    public void update(Object o) {
        em.merge(o);
    }

    public void flush() {
        em.flush();
    }
}
