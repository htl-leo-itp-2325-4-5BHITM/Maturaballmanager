package at.htlleonding.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

@Entity
@SequenceGenerator(name = "customer_id_gen", sequenceName = "customer_id_seq", initialValue = 50, allocationSize = 1)
public class Customer {

    @NotNull
    private boolean isVip = false;

    @NotNull
    private String sex;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @Id
    @GeneratedValue(generator = "customer_id_gen", strategy = GenerationType.SEQUENCE)
    private Long id;

    public Customer() {
    }

    public Customer(boolean isVip, String sex, String firstName, String lastName) {
        this();
        this.setSex(sex);
        this.setVip(isVip);
        this.setFirstName(firstName);
        this.setLastName(lastName);
    }

    public boolean isVip() {
        return isVip;
    }

    public Customer setVip(boolean vip) {
        this.isVip = vip;
        return this;
    }

    public String getSex() {
        return sex;
    }

    public Customer setSex(String sex) {
        this.sex = sex;
        return this;
    }

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
}
