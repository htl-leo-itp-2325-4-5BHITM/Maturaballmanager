package at.htlleonding.model.dto;

import at.htlleonding.entities.Address;

public record AddressDTO(String street, String zipCode, String town, String country) {
    public Address toEntity() {
        return new Address(street, zipCode, town, country);
    }
}
