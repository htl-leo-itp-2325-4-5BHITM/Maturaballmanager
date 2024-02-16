package at.htlleonding.repo;

import at.htlleonding.entities.Company;
import at.htlleonding.model.dto.company.CompanyOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class CompanyRepository {

    @Inject
    EntityManager em;

    public List<CompanyOverviewDTO> getCompanies() {
        return em.createQuery("SELECT new at.htlleonding.model.dto.company.CompanyOverviewDTO(c.id, c.name, c.officeMail, concat(c2.firstName, ' ', c2.lastName), coalesce(sum(item.price) , 0)) FROM Company c" +
                " LEFT JOIN c.contactPerson c2" +
                " LEFT JOIN Invoice i on c = i.company " +
                " LEFT JOIN BookedItem item on item.invoice = i" +
                " GROUP BY c.id, c.name, c.officeMail, c.contactPerson.firstName, c.contactPerson.lastName" +
                " ORDER BY c.name ASC", CompanyOverviewDTO.class).getResultList();
    }

    public void delete(Long companyId) {
        Company company = em.find(Company.class, companyId);
        if (company == null) throw new IllegalArgumentException("Company does not exist!");
        em.remove(company);
    }



}
