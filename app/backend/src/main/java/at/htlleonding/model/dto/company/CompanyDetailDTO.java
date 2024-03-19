package at.htlleonding.model.dto.company;

import at.htlleonding.model.dto.AddressDTO;
import at.htlleonding.model.dto.invoice.InvoiceOverviewDTO;

public record CompanyDetailDTO(long id, String companyName,
                               String officeMail, String officePhone,
                               AddressDTO address, ContactPersonDTO contactPerson,
                               InvoiceOverviewDTO[] invoices, double revenue) {

    public CompanyDetailDTO(long id, String companyName,
                            String officeMail, String officePhone, double revenue) {
        this(id, companyName, officeMail, officePhone, null, null, new InvoiceOverviewDTO[0], revenue);
    }
}