package at.htlleonding.model.dto.company;

import at.htlleonding.model.enums.CompanyStatus;

public record CompanyOverviewDTO(long id, String companyName, String officeMail, String officePhone, CompanyStatus status, double revenue) {
}
