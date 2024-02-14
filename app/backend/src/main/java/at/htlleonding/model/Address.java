package at.htlleonding.model;

import at.htlleonding.model.dto.AddressDTO;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Embeddable
public class Address {
    private String street;
    private String houseNumber;
    private String floor;

    private String door;
    private String zipCode;
    private String town;

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

    public void edit(AddressDTO dto) {
        this.setStreet(dto.address().getStreet());
        this.setHouseNumber(dto.address().getHouseNumber());
        this.setFloor(dto.address().getFloor());
        this.setDoor(dto.address().getDoor());
        this.setZipCode(dto.address().getZipCode());
        this.setTown(dto.address().getTown());
    }
    //</editor-fold>
}