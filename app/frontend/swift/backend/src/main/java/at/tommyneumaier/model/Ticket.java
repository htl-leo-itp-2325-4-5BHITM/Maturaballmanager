package at.tommyneumaier.model;

import jakarta.persistence.*;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 8, precision = 2)
    private double price;

    @Column(nullable = false)
    private boolean vip;

    @ManyToOne(cascade = CascadeType.ALL)
    private Customer customer;

    public Ticket() {
    }

    public long getId() {
        return id;
    }

    public Ticket setId(long id) {
        this.id = id;
        return this;
    }

    public double getPrice() {
        return price;
    }

    public Ticket setPrice(double price) {
        this.price = price;
        return this;
    }

    public boolean isVip() {
        return vip;
    }

    public Ticket setVip(boolean vip) {
        this.vip = vip;
        return this;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Ticket setCustomer(Customer customer) {
        this.customer = customer;
        return this;
    }
}
