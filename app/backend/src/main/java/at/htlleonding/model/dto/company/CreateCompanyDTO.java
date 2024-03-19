package at.htlleonding.model.dto.company;

import at.htlleonding.model.dto.AddressDTO;

import java.util.Set;

public record CreateCompanyDTO(String companyName, String website, String officeMail, AddressDTO address, ContactPersonDTO contactPerson){
}
