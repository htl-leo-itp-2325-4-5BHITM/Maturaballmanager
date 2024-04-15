package at.htlleonding.model.dto.tickets.qr;

import at.htlleonding.model.dto.customer.CustomerDTO;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "customer", "issuer" })
public record TicketDataDTO(CustomerDTO customer, String issuer) {
}
