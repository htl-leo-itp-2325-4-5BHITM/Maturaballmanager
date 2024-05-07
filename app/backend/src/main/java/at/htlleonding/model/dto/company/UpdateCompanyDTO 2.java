package at.htlleonding.model.dto.company;

import at.htlleonding.model.dto.AddressDTO;

public record UpdateCompanyDTO(String companyName, String website, String officeMail, AddressDTO address) {
}
