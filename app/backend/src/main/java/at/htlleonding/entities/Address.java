package at.htlleonding.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
@SequenceGenerator(name = "addressSeq", initialValue = 1, allocationSize = 1)
public class Address {
    private String street;
    private String zipCode;
    private String town;
    private String country;

    @Id
    @GeneratedValue(generator = "addressSeq")
    private Long id;

    public Address() {

    }

    public Address(String street, String zipCode, String town, String country) {
        this();
        this.setStreet(street);
        this.setZipCode(zipCode);
        this.setTown(town);
        this.setCountry(country);
    }

    //<editor-fold desc="Getter & Setter">
    public String getStreet() {
        return street;
    }

    public Address setStreet(String street) {
        this.street = street;
        return this;
    }

    public String getZipCode() {
        return zipCode;
    }

    public Address setZipCode(String zipCode) {
        this.zipCode = zipCode;
        return this;
    }

    public String getTown() {
        return town;
    }

    public Address setTown(String town) {
        this.town = town;
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCountry() {
        return country;
    }
    //</editor-fold>
}