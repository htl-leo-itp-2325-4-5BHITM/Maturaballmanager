package at.htlleonding.maturaballmanager.model.dtos

data class TeamMemberDTO(
    val keycloakId: String,
    val username: String,
    val email: String,
    val firstName: String?,
    val lastName: String?,
    val realmRoles: List<String>,
    val note: String?
)
