package at.htlleonding.model.dto.invoice;

import at.htlleonding.model.dto.invoice.items.ItemDTO;

import java.util.Set;

public record CreateInvoiceDTO(Long companyID, Set<ItemDTO> items) {
}
