package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.entities.TeamMember
import io.quarkus.hibernate.reactive.panache.Panache
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import io.smallrye.mutiny.Uni

@ApplicationScoped
class TeamMemberRepository : PanacheRepositoryBase<TeamMember, Long> {

    fun findByKeycloakId(keycloakId: String): Uni<TeamMember?> {
        return find("keycloakId", keycloakId).firstResult()
    }
}
