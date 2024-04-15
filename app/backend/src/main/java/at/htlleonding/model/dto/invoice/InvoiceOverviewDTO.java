package at.htlleonding.model.dto.invoice;

import at.htlleonding.model.enums.InvoiceStatus;

import java.time.LocalDate;

public record InvoiceOverviewDTO(Long id, LocalDate invoiceDate, LocalDate dueDate, InvoiceStatus status, double revenue) {
}
