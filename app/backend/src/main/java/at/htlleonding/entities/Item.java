package at.htlleonding.entities;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Item {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    public Item() {

    }

    public Item(String name, double price) {
        this();
        this.setName(name);
        this.setPrice(price);
    }

    //<editor-fold desc="Getter & Setter">
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Item setName(String name) {
        this.name = name;
        return this;
    }

    public double getPrice() {
        return price;
    }

    public Item setPrice(double price) {
        if(price >= 0) this.price = price;
        return this;
    }

    //</editor-fold>
}
