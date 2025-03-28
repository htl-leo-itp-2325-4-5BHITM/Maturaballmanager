package at.htlleonding.maturaballmanager.configs

import InvoiceDTO
import at.htlleonding.maturaballmanager.model.Address
import at.htlleonding.maturaballmanager.model.dtos.*
import at.htlleonding.maturaballmanager.model.entities.*

fun Appointment.toDTO(): AppointmentResponse {
    return AppointmentResponse(
        id = this.id,
        name = this.name,
        date = this.date,
        startTime = this.startTime,
        endTime = this.endTime,
        creator = SmallTeamMemberDTO(
            id = this.creator.id,
            firstName = this.creator.firstName,
            lastName = this.creator.lastName
        ),
        members = this.members.map {
            SmallTeamMemberDTO(
                id = it.id,
                firstName = it.firstName,
                lastName = it.lastName
            )
        }
    )
}

fun Invoice.toDTO(): InvoiceDTO {
    val cp = this.contactPerson
    val contactPersonFullName = if (cp != null) {
        "${cp.firstName} ${cp.lastName}"
    } else null

    return InvoiceDTO(
        id = this.id,

        company = this.company?.id,
        contactPerson = cp?.id,

        companyName = this.company?.name,
        contactPersonName = contactPersonFullName,

        benefits = this.benefits.map { it.id!! },
        invoiceDate = this.invoiceDate,
        paymentDeadline = this.paymentDeadline,
        status = this.status,
        totalAmount = this.totalAmount,
        sendOption = this.sendOption
    )
}


fun InvoiceDTO.toEntity(
    company: Company,
    contactPerson: ContactPerson?,
    benefits: List<Benefit>
): Invoice {
    val invoice = Invoice()
    invoice.id = this.id
    invoice.company = company
    invoice.contactPerson = contactPerson
    invoice.benefits = benefits.toMutableList()
    invoice.invoiceDate = this.invoiceDate
    invoice.paymentDeadline = this.paymentDeadline
    invoice.status = this.status
    invoice.totalAmount = this.totalAmount
    return invoice
}

fun Company.toDTO(): CompanyDTO {
    return CompanyDTO(
        id = this.id,
        name = this.name,
        industry = this.industry,
        website = this.website,
        officeEmail = this.officeEmail,
        officePhone = this.officePhone,
        address = this.address?.toDTO()
    )
}

fun CompanyDTO.toEntity(): Company {
    val company = Company()
    company.id = this.id
    company.name = this.name
    company.industry = this.industry
    company.website = this.website
    company.officeEmail = this.officeEmail
    company.officePhone = this.officePhone
    company.address = this.address?.toEntity()
    return company
}

fun ContactPerson.toDTO(): ContactPersonDTO {
    return ContactPersonDTO(
        id = this.id,
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.personalEmail,
        phone = this.personalPhone
    )
}

fun ContactPersonDTO.toEntity(): ContactPerson {
    val contactPerson = ContactPerson()
    contactPerson.id = this.id
    contactPerson.firstName = this.firstName
    contactPerson.lastName = this.lastName
    contactPerson.personalEmail = this.email
    contactPerson.personalPhone = this.phone
    return contactPerson
}

fun Benefit.toDTO(): BenefitDTO {
    return BenefitDTO(
        id = this.id,
        name = this.name,
        description = this.description,
        price = this.price
    )
}

fun BenefitDTO.toEntity(): Benefit {
    val benefit = Benefit()
    benefit.id = this.id
    benefit.name = this.name
    benefit.description = this.description
    benefit.price = this.price
    return benefit
}

fun Address.toDTO(): AddressDTO {
    return AddressDTO(
        street = this.street,
        houseNumber = this.houseNumber,
        floor = this.floor,
        door = this.door,
        postalCode = this.postalCode,
        city = this.city,
        country = this.country
    )
}

fun AddressDTO.toEntity(): Address {
    return Address(
        street = this.street,
        houseNumber = this.houseNumber,
        floor = this.floor,
        door = this.door,
        postalCode = this.postalCode,
        city = this.city,
        country = this.country
    )
}
