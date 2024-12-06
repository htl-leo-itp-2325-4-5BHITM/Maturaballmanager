package at.htlleonding.maturaballmanager.model.dtos

data class BenefitDTO(
    var id: String? = null,
    var name: String? = null,
    var description: String? = null,
    var price: Double = 0.0
)