package at.htlleonding.maturaballmanager.model.dtos

data class CompanyDTO(
    val id: String? = null,
    val name: String? = null,
    val industry: String? = null,
    val website: String? = null,
    val officeEmail: String? = null,
    val officePhone: String? = null,
    val address: AddressDTO? = null
)
