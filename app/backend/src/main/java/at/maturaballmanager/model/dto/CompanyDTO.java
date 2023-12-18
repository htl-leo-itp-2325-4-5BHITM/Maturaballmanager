package at.maturaballmanager.model.dto;

import at.maturaballmanager.model.Address;

public record CompanyDTO(String name, Address address, String website) {
}
