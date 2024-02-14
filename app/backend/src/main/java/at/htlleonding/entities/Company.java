package at.htlleonding.entities;

import at.htlleonding.model.Address;
import at.htlleonding.model.ContactPerson;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@SequenceGenerator(name = "company_seq", initialValue = 50, allocationSize = 1)
public class Company {

    @Id
    @GeneratedValue(generator = "company_seq")
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String website;

    private String officeMail;

    @Embedded
    private Address address;

    @Embedded
    private ContactPerson contactPerson;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Set<Bill> bills;

    public Company() {

    }

    public Company(String name) {
        this();
        this.setName(name);
    }

    public Company(String name, String website) {
        this(name);
        this.setWebsite(website);
    }

    public Company(String name, String website, String officeMail, Address address, ContactPerson contactPerson) {
        this(name, website);
        this.setAddress(address);
        this.setContactPerson(contactPerson);
    }

    //<editor-fold desc="Getter & Setter">
    public void setId(Long id) {
        this.id = id;
    }

    public Set<Bill> getBills() {
        return bills;
    }

    public String getOfficeMail() {
        return officeMail;
    }

    public Company setOfficeMail(String officeMail) {
        this.officeMail = officeMail;
        return this;
    }

    public Company setBills(Set<Bill> bills) {
        this.bills = bills;
        return this;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Company setName(String name) {
        this.name = name;
        return this;
    }

    public String getWebsite() {
        return website;
    }

    public Company setWebsite(String website) {
        this.website = website;
        return this;
    }

    public Address getAddress() {
        return address;
    }

    public Company setAddress(Address address) {
        this.address = address;
        return this;
    }

    public ContactPerson getContactPerson() {
        return contactPerson;
    }

    public Company setContactPerson(ContactPerson contactPerson) {
        this.contactPerson = contactPerson;
        return this;
    }
    //</editor-fold>
}
