package at.htlleonding.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
@SequenceGenerator(name = "addressSeq", initialValue = 1, allocationSize = 1)
public class Address {
    private String street;
    private String houseNumber;
    private String floor;

    private String door;
    private String zipCode;
    private String town;

    @Id
    @GeneratedValue(generator = "addressSeq")
    private Long id;

    public Address() {

    }

    public Address(String street, String houseNumber, String zipCode, String town) {
        this();
        this.setStreet(street);
        this.setHouseNumber(houseNumber);
        this.setZipCode(zipCode);
        this.setTown(town);
    }

    public Address(String street, String houseNumber, String floor, String door, String zipCode, String town) {
        this(street, houseNumber, zipCode, town);
        this.setFloor(floor);
        this.setDoor(door);
    }

    //<editor-fold desc="Getter & Setter">
    public String getStreet() {
        return street;
    }

    public Address setStreet(String street) {
        this.street = street;
        return this;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public Address setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
        return this;
    }

    public String getFloor() {
        return floor;
    }

    public Address setFloor(String floor) {
        this.floor = floor;
        return this;
    }

    public String getDoor() {
        return door;
    }

    public Address setDoor(String door) {
        this.door = door;
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
    //</editor-fold>
}