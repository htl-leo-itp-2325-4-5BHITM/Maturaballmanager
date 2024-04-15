package at.htlleonding.model.dto.tickets.qr;

import at.htlleonding.model.dto.customer.CustomerDTO;

public record TicketSummaryDTO(CustomerDTO customer, String issuer, String signature) {
}
