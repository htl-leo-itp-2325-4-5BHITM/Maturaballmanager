package at.htlleonding.model.dto.company;

public record ContactPersonDTO(Long id, String firstName, String lastName, String mailAddress, String phoneNumber, String position, char sex) {
}
