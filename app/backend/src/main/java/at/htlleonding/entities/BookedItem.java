package at.htlleonding.entities;

import jakarta.persistence.*;

@Entity
public class BookedItem extends Item {

    @ManyToOne(cascade = CascadeType.ALL)
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
