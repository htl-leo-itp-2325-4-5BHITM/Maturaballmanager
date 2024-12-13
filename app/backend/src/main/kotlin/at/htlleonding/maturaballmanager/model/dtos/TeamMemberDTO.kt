package at.htlleonding.maturaballmanager.model.dtos

import jakarta.json.bind.annotation.JsonbCreator
import jakarta.json.bind.annotation.JsonbProperty

data class TeamMemberDTO @JsonbCreator constructor(
    @JsonbProperty("keycloakId") val keycloakId: String,
    @JsonbProperty("username") val username: String,
    @JsonbProperty("email") val email: String,
    @JsonbProperty("firstName") val firstName: String?,
    @JsonbProperty("lastName") val lastName: String?,
    @JsonbProperty("realmRoles") val realmRoles: List<String>,
    @JsonbProperty("note") val note: String?
)