package at.htlleonding.maturaballmanager.model.dtos

data class AddressDTO(
    val street: String? = null,
    val houseNumber: String? = null,
    val floor: String? = null,
    val door: String? = null,
    val postalCode: String? = null,
    val city: String? = null,
    val country: String? = "AT"
)