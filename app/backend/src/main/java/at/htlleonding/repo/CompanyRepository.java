package at.htlleonding.repo;

import at.htlleonding.entities.Address;
import at.htlleonding.entities.Company;
import at.htlleonding.entities.ContactPerson;
import at.htlleonding.model.dto.company.*;
import at.htlleonding.model.dto.invoice.InvoiceDetailDTO;
import at.htlleonding.model.dto.invoice.InvoiceOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.*;

@ApplicationScoped
public class CompanyRepository {

    @Inject
    EntityManager em;

    @Inject
    InvoiceRepository invoiceRepository;

    public List<CompanyOverviewDTO> getCompanyOverview() {
        return em.createQuery("SELECT new at.htlleonding.model.dto.company.CompanyOverviewDTO(c.id, c.name, c.officeMail, concat(' ', 'nege'), coalesce(sum(item.price) , 0)) FROM Company c" +
                " LEFT JOIN Invoice i on c = i.company " +
                " LEFT JOIN BookedItem item on item.invoice = i" +
                " GROUP BY c.id, c.name" +
                " ORDER BY c.name ASC", CompanyOverviewDTO.class).getResultList();
    }

    public CompanyDetailDTO getCompanyDetail(Long id) {
        CompanyDetailDTO dto = em.createQuery("SELECT new at.htlleonding.model.dto.company.CompanyDetailDTO(c.id, c.name, c.officeMail, c.officePhone, coalesce(sum(item.price), 0)) " +
                "FROM Company c " +
                "LEFT JOIN Invoice i on c = i.company " +
                "LEFT JOIN BookedItem item on item.invoice = i " +
                "WHERE c.id = :id " +
                "GROUP BY c.id, c.name, c.officeMail, c.officePhone, c.address", CompanyDetailDTO.class).setParameter("id", id).getSingleResult();
        if (dto == null) throw new IllegalArgumentException("Company does not exist!");

        InvoiceOverviewDTO[] invoices = em.createQuery("SELECT new at.htlleonding.model.dto.invoice.InvoiceOverviewDTO(i.id, i.bookingDate) FROM Invoice i WHERE i.company.id = :id", InvoiceOverviewDTO.class).setParameter("id", id).getResultList().toArray(InvoiceOverviewDTO[]::new);
        ContactPersonDTO[] contactPersons = em.createQuery("SELECT new at.htlleonding.model.dto.company.ContactPersonDTO(c.id, c.firstName, c.lastName, c.mail, c.position, c.sex) FROM ContactPerson c WHERE c.company.id = :id", ContactPersonDTO.class).setParameter("id", id).getResultList().toArray(ContactPersonDTO[]::new);
        return new CompanyDetailDTO(dto.id(), dto.companyName(), dto.officeMail(), dto.officePhone(),dto.address(), contactPersons, invoices, dto.revenue());
    }

    public void delete(Long companyId) {
        Company company = em.find(Company.class, companyId);
        if (company == null) throw new IllegalArgumentException("Company does not exist!");
        em.remove(company);
    }


    public void add(CreateCompanyDTO dto) {
        if (dto.companyName() == null) throw new IllegalArgumentException("Company name must not be null!");
        Set<ContactPerson> contactPersons = new HashSet<>();
        Address address = null;

        if (dto.contactPersons() != null) dto.contactPersons().forEach(c -> {
            if (Arrays.stream(c.getClass().getRecordComponents()).anyMatch(Objects::isNull))
                throw new IllegalArgumentException("Contact person must not be null!");
            ContactPerson contactPerson = new ContactPerson(c.firstName(), c.lastName(), c.mail(), c.position(), c.sex());
            em.persist(contactPerson);
            contactPersons.add(contactPerson);
        });

        if (dto.address() != null) {
            address = dto.address().toEntity();
            em.persist(address);
        }

        Company company = new Company(dto.companyName(), dto.website(), dto.officeMail(), address, contactPersons);
        em.persist(company);
        contactPersons.forEach(c -> c.setCompany(company));
    }

    public void updateCompany(UpdateCompanyDTO dto, Long id) {
        if (dto.companyName() == null) throw new IllegalArgumentException("Company name must not be null!");

        Address address = null;
        if (dto.address() != null) {
            address = dto.address().toEntity();
            em.persist(address);
        }

        Company company = em.find(Company.class, id);
        company.setName(dto.companyName());
        company.setWebsite(dto.website());
        company.setOfficeMail(dto.officeMail());
        company.setAddress(address);
    }

    public void updateContactPerson(ContactPersonDTO dto, Long id) {
        if (dto.firstName() == null || dto.lastName() == null || dto.mail() == null || dto.position() == null || (dto.sex() != 'F' && dto.sex() != 'M')) throw new IllegalArgumentException("Contact person must not be null!");

        ContactPerson contactPerson = em.find(ContactPerson.class, id);
        contactPerson.setFirstName(dto.firstName());
        contactPerson.setLastName(dto.lastName());
        contactPerson.setMail(dto.mail());
        contactPerson.setPosition(dto.position());
        contactPerson.setSex(dto.sex());
    }
}
