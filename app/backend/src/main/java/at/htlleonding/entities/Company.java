package at.htlleonding.entities;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@SequenceGenerator(name = "company_seq", initialValue = 50, allocationSize = 1)
public class Company {

    @Id
    @GeneratedValue(generator = "company_seq")
    private Long id;

    @Column(nullable = false)
    private String name;

    private String website;

    private String officeMail;

    @OneToOne(cascade = CascadeType.ALL)
    private Address address;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "company")
    private Set<ContactPerson> contactPersons;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Set<Invoice> invoices;

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

    public Company(String name, String website, String officeMail, Address address, Set<ContactPerson> contactPersons) {
        this(name, website);
        this.setAddress(address);
        this.setContactPersons(contactPersons);
    }

    //<editor-fold desc="Getter & Setter">
    public Long getId() {
        return id;
    }

    public Company setId(Long id) {
        this.id = id;
        return this;
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

    public String getOfficeMail() {
        return officeMail;
    }

    public Company setOfficeMail(String officeMail) {
        this.officeMail = officeMail;
        return this;
    }

    public Address getAddress() {
        return address;
    }

    public Company setAddress(Address address) {
        this.address = address;
        return this;
    }

    public Set<ContactPerson> getContactPersons() {
        return contactPersons;
    }

    public Company setContactPersons(Set<ContactPerson> contactPersons) {
        this.contactPersons = contactPersons;
        return this;
    }

    public Set<Invoice> getInvoices() {
        return invoices;
    }

    public Company setInvoices(Set<Invoice> invoices) {
        this.invoices = invoices;
        return this;
    }


    //</editor-fold>
}
