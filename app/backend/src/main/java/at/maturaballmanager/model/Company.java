package at.maturaballmanager.model;

import at.maturaballmanager.services.ValidationTool;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

@Entity
public class Company extends PanacheEntity implements Serializable {

    @Column(length = 50)
    public String name;

    @OneToMany(mappedBy = "company")
    public Set<Bill> bills;

    @OneToOne
    @JoinTable(name = "FK_ContactPerson_Address")
    public Address address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name = "FK_ContactPerson_Company")
    public ContactPerson contactPerson;

    @Column(length = 100, nullable = false)
    public String website;

    @Column(length = 50)
    @JsonIgnore
    public String imagePath;

    public Company(String name, Address address, String website) {
        this.name = name;
        this.address = address;
        this.website = website;
    }

    public Company() {

    }

    @PrePersist
    @PreUpdate
    private void validate() {
        this.website = ValidationTool.validateWebsite(website);
    }
}
