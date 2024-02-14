package at.htlleonding.model.dto;

import at.htlleonding.entities.BookedItem;

import java.time.LocalDate;
import java.util.Set;

public record SingleBillDTO(Long id, String companyName, Set<BookedItem> items, LocalDate date) {
}
