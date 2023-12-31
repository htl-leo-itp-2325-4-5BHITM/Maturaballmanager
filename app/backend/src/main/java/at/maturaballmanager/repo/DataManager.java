package at.maturaballmanager.repo;

import at.maturaballmanager.model.Company;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

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

    public List<Company> getCompanyList() {
        return em.createQuery("SELECT c FROM Company c", Company.class).getResultList();
    }

    @Transactional
    public void delete(Object o) {
        em.remove(o);
    }

    @Transactional
    public void delete(String clazz, Long id) {
        try {
            em.remove(em.find(Class.forName("at.maturaballmanager.model." + clazz.substring(0,1).toUpperCase() + clazz.substring(1)), id));
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void update(Object o) {
        em.merge(o);
    }

    public void flush() {
        em.flush();
    }
}
