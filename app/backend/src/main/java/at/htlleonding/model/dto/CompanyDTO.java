package at.htlleonding.model.dto;

import at.htlleonding.model.Address;
import at.htlleonding.model.ContactPerson;

public record CompanyDTO(String name, String website, String officeMail, ContactPerson contactPerson, Address address) {

}