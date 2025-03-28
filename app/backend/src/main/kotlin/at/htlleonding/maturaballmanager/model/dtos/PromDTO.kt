package at.htlleonding.maturaballmanager.model.dtos

data class DayPlanDTO(
    var name: String? = null,
    var time: String? = null
)

data class PromDTO(
    var motto: String? = null,
    var date: String? = null,
    var time: String? = null,
    var street: String? = null,
    var houseNumber: String? = null,
    var zip: String? = null,
    var city: String? = null,
    var dayPlan: List<DayPlanDTO>? = null
)
