package at.htlleonding.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.Set;

@Entity
public class Customer {

    private String firstName;

    private String lastName;

    @Id
    private Long id;

    @OneToMany
    private Set<Customer> customers;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public Customer setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public Customer setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public Set<Customer> getCustomers() {
        return customers;
    }

    public Customer setCustomers(Set<Customer> customers) {
        this.customers = customers;
        return this;
    }
}
