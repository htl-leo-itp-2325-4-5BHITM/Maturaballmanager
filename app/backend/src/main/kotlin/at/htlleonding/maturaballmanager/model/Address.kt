package at.htlleonding.maturaballmanager.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class Address(
    var street: String? = null,

    @Column(name = "house_number")
    var house_number: String? = null,

    var floor: String? = null,

    var door: String? = null,

    @Column(name = "postal_code")
    var postal_code: String? = null,

    var city: String? = null,

    var country: String? = "AT"
)