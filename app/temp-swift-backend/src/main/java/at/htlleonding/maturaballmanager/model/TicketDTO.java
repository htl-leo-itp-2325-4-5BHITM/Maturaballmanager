package at.htlleonding.maturaballmanager.model;

import java.time.LocalDate;

public record TicketDTO(Long id, boolean redeemed, UserDTO user, String digitalSignature) {
}
