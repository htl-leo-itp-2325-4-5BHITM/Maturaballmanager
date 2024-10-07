// src/main/kotlin/at/htlleonding/maturaballmanager/model/Address.kt

package at.htlleonding.maturaballmanager.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

@Embeddable
data class Address(
    @NotBlank(message = "Straße ist erforderlich")
    var street: String? = null,

    @NotBlank(message = "Hausnummer ist erforderlich")
    @Column(name = "house_number")
    var houseNumber: String? = null,

    var floor: String? = null,

    var door: String? = null,

    @NotBlank(message = "Postleitzahl ist erforderlich")
    @Pattern(regexp = "^[0-9]{4,5}$", message = "Bitte eine gültige Postleitzahl eingeben")
    @Column(name = "postal_code")
    var postalCode: String? = null,

    @NotBlank(message = "Stadt ist erforderlich")
    var city: String? = null,

    var country: String? = "AT"
)