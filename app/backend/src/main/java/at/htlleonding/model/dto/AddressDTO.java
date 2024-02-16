package at.htlleonding.model.dto;

import at.htlleonding.entities.Address;

public record AddressDTO(String street, String streetNumber, String city, String zipCode, String country) {
    public Address toEntity() {
        return new Address(street, streetNumber, zipCode, city);
    }
}
