package at.htlleonding.repo;

import at.htlleonding.entities.Invoice;
import at.htlleonding.model.dto.invoice.InvoiceOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class InvoiceRepository {

    @Inject
    EntityManager em;

    @Inject
    ItemRepository itemRepository;

    public List<InvoiceOverviewDTO> getByCompany(Long companyId) {
        return em.createQuery("SELECT new at.htlleonding.model.dto.invoice.InvoiceOverviewDTO(i.id, i.bookingDate, i.dueDate, i.status, coalesce(sum(item.price), 0)) FROM Invoice i LEFT JOIN BookedItem item on i = item.invoice WHERE i.company.id = :companyId GROUP BY i.id, i.bookingDate, i.dueDate, i.status ORDER BY i.bookingDate DESC", InvoiceOverviewDTO.class).setParameter("companyId", companyId).getResultList();
    }

    public void delete(Long invoiceId) {
        Invoice invoice = em.find(Invoice.class, invoiceId);
        if (invoice != null) em.remove(invoice);
        throw new IllegalArgumentException("Invoice does not exist!");
    }
}
