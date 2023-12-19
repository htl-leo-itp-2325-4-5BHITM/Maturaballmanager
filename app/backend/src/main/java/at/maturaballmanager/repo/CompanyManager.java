package at.maturaballmanager.repo;

import at.maturaballmanager.model.Company;
import at.maturaballmanager.services.CSVExport;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.io.ByteArrayInputStream;
import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class CompanyManager {

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
            em.remove(em.find(Class.forName("at.maturaballmanager.model." + clazz.substring(0, 1).toUpperCase() + clazz.substring(1)), id));
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void update(Object o) {
        em.merge(o);
    }

    public void deleteCompanies(List<Long> ids) {
        if (ids == null) throw new IllegalArgumentException("Invalid list");
        ids.forEach((id) -> {
            if (id == null) throw new IllegalArgumentException("Invalid list item");
        });

        ids.forEach((id) -> {
            Company c = em.find(Company.class, id);
            em.remove(c);
        });
    }

    public ByteArrayInputStream loadCSVExport() {
        return CSVExport.companiesToCSV(getCompanyList());
    }

    public List<String> getSelectedCompanyNames(List<Long> ids) {
        List<String> companyNames = new LinkedList<>();

        ids.forEach((id) -> {
            Company company = em.find(Company.class, id);
            companyNames.add(company.name);
        });
        return companyNames;
    }
}
