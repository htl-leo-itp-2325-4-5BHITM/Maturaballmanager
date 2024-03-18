package at.htlleonding.model.dto.company;

import at.htlleonding.entities.Address;
import at.htlleonding.model.dto.invoice.InvoiceOverviewDTO;

public record CompanyDetailDTO(long id, String companyName, String officeMail, String officePhone, Address address, ContactPersonDTO[] contactPersons, InvoiceOverviewDTO[] invoices, double revenue) {

    public CompanyDetailDTO(long id, String companyName, String officeMail, String officePhone, Address address, double revenue) {
        this(id, companyName, officeMail, officePhone, address, new ContactPersonDTO[0], new InvoiceOverviewDTO[0], revenue);
    }

    public CompanyDetailDTO(long id, String companyName, String officeMail, String officePhone, double revenue) {
        this(id, companyName, officeMail, officePhone, new Address(), new ContactPersonDTO[0], new InvoiceOverviewDTO[0], revenue);
    }
}