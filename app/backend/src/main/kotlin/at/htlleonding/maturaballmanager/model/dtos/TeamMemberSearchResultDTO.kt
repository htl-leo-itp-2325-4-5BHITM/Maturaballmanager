package at.htlleonding.maturaballmanager.model.dtos

data class TeamMemberSearchResultDTO(
    val keycloakId: String,
    val username: String,
    val email: String,
    val firstName: String?,
    val lastName: String?
)
