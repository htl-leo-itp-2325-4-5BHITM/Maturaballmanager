package at.htlleonding.model.dto;

import java.util.Set;

public record InvoiceDTO(String companyName, Set<ItemDTO> items) {
}
