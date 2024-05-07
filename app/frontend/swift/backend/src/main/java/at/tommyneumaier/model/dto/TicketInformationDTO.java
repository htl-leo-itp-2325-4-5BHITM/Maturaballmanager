package at.tommyneumaier.model.dto;

public record TicketInformationDTO(
        long id,
        CustomerInformationDTO customer
) {
}
