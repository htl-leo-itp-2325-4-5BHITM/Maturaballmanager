package at.htlleonding.model.dto;

import java.util.Set;
import java.time.LocalDate;

public record BillDTO( String companyName, Set<ItemDTO> items) {
}
