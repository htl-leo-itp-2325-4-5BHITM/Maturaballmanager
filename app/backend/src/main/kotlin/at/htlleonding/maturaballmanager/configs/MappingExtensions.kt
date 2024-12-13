package at.htlleonding.maturaballmanager.configs

import at.htlleonding.maturaballmanager.model.Address
import at.htlleonding.maturaballmanager.model.dtos.*
import at.htlleonding.maturaballmanager.model.entities.*

fun Invoice.toDTO(): InvoiceDTO {
    return InvoiceDTO(
        id = this.id,
        invoiceNumber = this.invoiceNumber,
        company = this.company?.id,
        contactPerson = this.contactPerson?.id,
        benefits = this.benefits.map { it.id!! },
        invoiceDate = this.invoiceDate,
        paymentDeadline = this.paymentDeadline,
        status = this.status,
        totalAmount = this.totalAmount
    )
}

fun InvoiceDTO.toEntity(
    company: Company,
    contactPerson: ContactPerson?,
    benefits: List<Benefit>
): Invoice {
    val invoice = Invoice()
    invoice.id = this.id
    invoice.invoiceNumber = this.invoiceNumber
    invoice.company = company
    invoice.contactPerson = contactPerson
    invoice.benefits = benefits.toMutableList()
    invoice.invoiceDate = this.invoiceDate
    invoice.paymentDeadline = this.paymentDeadline
    invoice.status = this.status
    invoice.totalAmount = this.totalAmount
    return invoice
}

// Company Mapping
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

// ContactPerson Mapping
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

// Address Mapping
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
