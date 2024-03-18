package at.htlleonding.repo;

import at.htlleonding.entities.Company;
import at.htlleonding.entities.ContactPerson;
import at.htlleonding.entities.Invoice;
import at.htlleonding.model.dto.company.ContactPersonDTO;
import at.htlleonding.model.dto.invoice.CreateInvoiceDTO;
import at.htlleonding.model.dto.invoice.InvoiceDetailDTO;
import at.htlleonding.services.MailService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Set;

@ApplicationScoped
public class InvoiceRepository {

    @Inject
    EntityManager em;

    @Inject
    ItemRepository itemRepository;

    @Inject
    MailService mailService;

    public List<Long> getByCompany(Long companyId) {
        return em.createQuery("SELECT new at.htlleonding.model.dto.invoice.InvoiceOverviewDTO(i.id, i.bookingDate) FROM Invoice i WHERE i.company.id = :companyId ORDER BY i.bookingDate DESC", Long.class).setParameter("companyId", companyId).getResultList();
    }

    public void delete(Long invoiceId) {
        Invoice invoice = em.find(Invoice.class, invoiceId);
        if (invoice != null) em.remove(invoice);
        throw new IllegalArgumentException("Invoice does not exist!");
    }

    public void add(CreateInvoiceDTO dto) {
        if (dto.companyId() == null || dto.items() == null)
            throw new IllegalArgumentException("DTO is not valid!");

        Invoice invoice = new Invoice(em.find(Company.class, dto.companyId()));
        em.persist(invoice);
        dto.items().forEach(item -> itemRepository.add(item, invoice.getId()));
        invoice.setItems(Set.copyOf(itemRepository.getItemsByInvoice(invoice.getId())));

        ContactPerson contactPerson = em.find(ContactPerson.class, dto.contactPersonId());
        InvoiceDetailDTO invoiceDTO = new InvoiceDetailDTO(invoice.getId(),
                invoice.getCompany().getName(),
                invoice.getCompany().getOfficeMail(),
                contactPerson == null ? null : new ContactPersonDTO(contactPerson.getId(),contactPerson.getFirstName(), contactPerson.getLastName(), contactPerson.getMail(), contactPerson.getPosition(), contactPerson.getSex()),
                invoice.getBookingDate(),
                dto.items());
        mailService.sendInvoice(invoiceDTO);
    }
}
