package at.htlleonding.repo;

import at.htlleonding.entities.Company;
import at.htlleonding.model.dto.AddressDTO;
import at.htlleonding.model.dto.company.*;
import at.htlleonding.model.dto.invoice.InvoiceOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import java.util.*;

@ApplicationScoped
public class CompanyRepository {

    @Inject
    EntityManager em;

    @Inject
    InvoiceRepository invoiceRepository;

    public List<CompanyOverviewDTO> getCompanyOverview() {
        return em.createQuery("SELECT new at.htlleonding.model.dto.company.CompanyOverviewDTO(c.id, c.name, c.officeMail, c.officePhone, c.status, coalesce(sum(item.price) , 0)) FROM Company c" + " LEFT JOIN Invoice i on c = i.company " + " LEFT JOIN BookedItem item on item.invoice = i" + " GROUP BY c.id, c.name, c.officePhone, c.officeMail, c.status " + " ORDER BY c.name ASC", CompanyOverviewDTO.class).getResultList();
    }

    public CompanyDetailDTO getCompanyDetail(Long id) {
        CompanyDetailDTO company = em.createQuery("SELECT new at.htlleonding.model.dto.company.CompanyDetailDTO(c.id, c.website, c.officeMail, c.officePhone, null, null, null) FROM Company c WHERE c.id = :id", CompanyDetailDTO.class).setParameter("id", id).getSingleResult();

        AddressDTO address = new AddressDTO("Keine Adresse festgelegt", "", "", "");
        try {
            address = em.createQuery("SELECT new at.htlleonding.model.dto.AddressDTO(a.street, a.zipCode, a.town, a.country) FROM Company c JOIN c.address a WHERE c.id = :id", AddressDTO.class).setParameter("id", id).getSingleResult();
        } catch (NoResultException e) {
            new AddressDTO("", "", "", "");
        }

        List<ContactPersonDTO> contactPersons = new ArrayList<>();
        try {
            contactPersons = em.createQuery("SELECT new at.htlleonding.model.dto.company.ContactPersonDTO(cp.id, cp.firstName, cp.lastName, cp.mail, cp.phoneNumber, cp.position, cp.sex) FROM Company c JOIN ContactPerson cp ON cp.company = c WHERE c.id = :id ORDER BY cp.lastName", ContactPersonDTO.class).setParameter("id", id).getResultList();
        } catch (NoResultException e) {
            new ArrayList<>();
        }

        List<InvoiceOverviewDTO> invoices = new ArrayList<>();
        try {
            invoices = invoiceRepository.getByCompany(id);
        } catch (NoResultException e) {
            new ArrayList<>();
        }
        return new CompanyDetailDTO(company.id(), company.website(), company.officeMail(), company.officePhone(), address, contactPersons, invoices);
    }

    public void delete(Long companyId) {
        Company company = em.find(Company.class, companyId);
        if (company == null) throw new IllegalArgumentException("Company does not exist!");
        em.remove(company);
    }
}
