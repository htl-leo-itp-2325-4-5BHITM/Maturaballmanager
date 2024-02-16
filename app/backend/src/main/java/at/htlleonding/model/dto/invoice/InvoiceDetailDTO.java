package at.htlleonding.model.dto.invoice;

import at.htlleonding.model.dto.company.ContactPersonDTO;
import at.htlleonding.model.dto.invoice.items.ItemDTO;

import java.time.LocalDate;
import java.util.Set;

public record InvoiceDetailDTO(Long id, String companyName, String officeMail, ContactPersonDTO contactPerson, LocalDate invoiceDate, Set<ItemDTO> items) {
}
