package at.htlleonding.repo;

import at.htlleonding.entities.Invoice;
import at.htlleonding.entities.item.BookedItem;
import at.htlleonding.model.dto.invoice.items.ItemDTO;
import at.htlleonding.model.dto.invoice.items.ItemTemplateDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class ItemRepository {

    @Inject
    EntityManager em;

    public List<String> getItemTemplateOverview() {
        return em.createQuery("SELECT i.name FROM ItemTemplate i ORDER BY i.price DESC", String.class).getResultList();
    }

    public List<ItemTemplateDTO> getItemTemplateDetails() {
        return em.createQuery("SELECT new at.htlleonding.model.dto.invoice.items.ItemTemplateDTO(i.name, i.price) FROM ItemTemplate i ORDER BY i.price DESC", ItemTemplateDTO.class).getResultList();
    }

    public boolean add(ItemDTO item, long invoiceId) {
        if (Arrays.stream(item.getClass().getRecordComponents()).allMatch(Objects::nonNull)) {
            if (item.price() >= 0) {
                em.persist(new BookedItem(item.name(), item.price(), em.find(Invoice.class, invoiceId)));
                return true;
            }
            throw new IllegalArgumentException("Price is less than 0!");
        }
        throw new IllegalArgumentException("DTO is not valid!");
    }

    protected List<BookedItem> getItemsByInvoice(Long invoiceId) {
        return em.createQuery("SELECT i FROM BookedItem i WHERE i.invoice.id = :invoiceId", BookedItem.class).setParameter("invoiceId", invoiceId).getResultList();
    }
}
