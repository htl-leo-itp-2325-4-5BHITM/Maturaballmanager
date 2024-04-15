package at.htlleonding.model.dto.company;

import at.htlleonding.model.dto.AddressDTO;
import at.htlleonding.model.dto.invoice.InvoiceOverviewDTO;

import java.util.List;

public record CompanyDetailDTO(long id, String website, String officeMail, String officePhone, AddressDTO address, List<ContactPersonDTO> contactPersons, List<InvoiceOverviewDTO> invoices) {

    public CompanyDetailDTO(long id, String website, String officeMail, String officePhone, Object o, Object o1, Object o2) {
        this(id, website, officeMail, officePhone, null, null, null);
    }
}