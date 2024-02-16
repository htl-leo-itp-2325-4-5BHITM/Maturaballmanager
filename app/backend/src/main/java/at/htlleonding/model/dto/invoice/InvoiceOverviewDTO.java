package at.htlleonding.model.dto.invoice;

import java.time.LocalDate;

public record InvoiceOverviewDTO(Long id, String companyName, LocalDate invoiceDate) {
}
