package at.htlleonding.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Ticket {

    @Id
    private Long id;

    private double price;

    @ManyToOne
    private Customer customer;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public double getPrice() {
        return price;
    }

    public Ticket setPrice(double price) {
        this.price = price;
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
