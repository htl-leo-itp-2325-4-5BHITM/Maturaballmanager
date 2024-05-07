package at.tommyneumaier.model.dto;

import java.time.LocalDate;

public record CustomerInformationDTO(
        char sex, String name, LocalDate birthDate
) {
}