package at.htlleonding.entities.item;

import at.htlleonding.entities.Invoice;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class BookedItem extends Item {

    @ManyToOne(cascade = CascadeType.ALL)
    public Invoice invoice;

    public BookedItem() {
        super();
    }

    public BookedItem(String name, float price) {
        super(name, price);
    }

    public BookedItem(String name, float price, Invoice invoice) {
        this(name, price);
        this.setInvoice(invoice);
    }

    //<editor-fold desc="Getter & Setter">

    public Invoice getInvoice() {
        return invoice;
    }

    public BookedItem setInvoice(Invoice invoice) {
        this.invoice = invoice;
        return this;
    }

    //</editor-fold>
}
