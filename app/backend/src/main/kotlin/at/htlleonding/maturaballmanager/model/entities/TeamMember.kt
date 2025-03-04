package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.dtos.SmallTeamMemberDTO
import at.htlleonding.maturaballmanager.repositories.PromRepository
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "team_members")
data class TeamMember(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long = -1,

        @Column(name = "keycloak_id", unique = true, nullable = false)
        var keycloakId: String,

        @Column(nullable = false)
        var username: String,

        @Column(nullable = false)
        var email: String,

        var firstName: String? = null,

        var lastName: String? = null,

        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(
                name = "team_member_realm_roles",
                joinColumns = [JoinColumn(name = "team_member_id")]
        )
        @Column(name = "role", nullable = false)
        var realmRoles: MutableList<String> = mutableListOf(),

        @Column(columnDefinition = "TEXT")
        var note: String? = null,

        var initialStoredAt: LocalDateTime = LocalDateTime.now(),

        var syncedAt: LocalDateTime = LocalDateTime.now(),

        @ManyToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        var prom: Prom?= null
) : PanacheEntityBase() {
        constructor() : this(-1, "", "", "", "", "", mutableListOf(), "", LocalDateTime.now(), LocalDateTime.now())

        fun toSmallDTO(): SmallTeamMemberDTO {
                return SmallTeamMemberDTO(
                        id = id,
                        firstName = firstName,
                        lastName = lastName
                )
        }
}