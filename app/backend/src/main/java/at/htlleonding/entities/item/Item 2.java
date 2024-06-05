package at.htlleonding.entities.item;

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
    private float price;

    public Item() {

    }

    public Item(String name, float price) {
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

    public Item setPrice(float price) {
        if(price >= 0) this.price = price;
        return this;
    }

    //</editor-fold>
}
