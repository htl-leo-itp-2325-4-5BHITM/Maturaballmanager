package at.htlleonding.repo;

import at.htlleonding.entities.Invoice;
import at.htlleonding.entities.BookedItem;
import at.htlleonding.entities.Company;
import at.htlleonding.model.dto.InvoiceDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class InvoiceManager {

    @Inject
    EntityManager em;

    @Inject
    CompanyManager cm;

    public void addBill(InvoiceDTO dto) {
        Company company = cm.getCompanyByName(dto.companyName());
        if(company == null) throw new IllegalArgumentException();

        Invoice bill = new Invoice(company);
        Set<BookedItem> bookedItemSet = new HashSet<>();
        dto.items().forEach((itemDTO -> {
            if(!itemDTO.itemName().isBlank() || !itemDTO.itemName().isEmpty()) {
                BookedItem bookedItem = new BookedItem(itemDTO.itemName(), itemDTO.price());
                em.persist(bookedItem);
                bookedItemSet.add(bookedItem);
            }
        }));
        bill.setItems(bookedItemSet);
    }

    public void deleteBill(Long id) {
        Invoice bill = getBill(id);
        if(bill == null) throw new IllegalArgumentException();
        em.remove(bill);
    }

    public Invoice getBill(Long id) {
        return em.find(Invoice.class, id);
    }
}
