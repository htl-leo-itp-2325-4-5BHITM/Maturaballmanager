package at.htlleonding.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;

@Entity
public class BookedItem extends Item {

    @ManyToOne
    public Bill bill;

    public BookedItem() {
        super();
    }

    public BookedItem(String name, double price) {
        super(name, price);
    }

    //<editor-fold desc="Getter & Setter">
    public Bill getBill() {
        return bill;
    }

    public BookedItem setBill(Bill bill) {
        this.bill = bill;
        return this;
    }
    //</editor-fold>
}
