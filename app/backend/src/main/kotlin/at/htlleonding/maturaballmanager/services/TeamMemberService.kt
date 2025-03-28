package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.dtos.DetailedTeamMemberDTO
import at.htlleonding.maturaballmanager.model.dtos.TeamMemberDTO
import at.htlleonding.maturaballmanager.model.dtos.TeamMemberSearchResultDTO
import at.htlleonding.maturaballmanager.model.entities.TeamMember
import at.htlleonding.maturaballmanager.repositories.PromRepository
import at.htlleonding.maturaballmanager.repositories.TeamMemberRepository
import io.quarkus.hibernate.reactive.panache.common.WithSession
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.NotFoundException
import org.keycloak.representations.idm.UserRepresentation
import java.time.LocalDateTime
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@ApplicationScoped
class TeamMemberService {

    @Inject
    lateinit var promRepository: PromRepository

    private val logger: Logger = LoggerFactory.getLogger(TeamMemberService::class.java)

    @Inject
    lateinit var keycloakAdminService: KeycloakAdminService

    @Inject
    lateinit var repository: TeamMemberRepository

    fun findById(id: String): Uni<TeamMember> {
        return repository.find("keycloakId", id).firstResult()
    }

    fun findById(id: Long): Uni<TeamMember> {
        return repository.find("id", id).firstResult()
    }

    /**
     * Adds an existing TeamMember by assigning roles in Keycloak and creating a local entity.
     */
    @WithTransaction
    fun addTeamMember(teamMemberDTO: TeamMemberDTO): Uni<DetailedTeamMemberDTO> {
        val keycloakId = teamMemberDTO.keycloakId
        val rolesToAdd = teamMemberDTO.realmRoles.filter { !it.startsWith("uma-") }

        return keycloakAdminService.assignClientRolesToUser(keycloakId, rolesToAdd)
            .flatMap {
                keycloakAdminService.getUserRepresentation(keycloakId)
            }
            .flatMap { userRepresentation: UserRepresentation? ->
                if (userRepresentation != null) {
                    val teamMember = TeamMember(
                        keycloakId = userRepresentation.id ?: "",
                        username = userRepresentation.username ?: "",
                        email = userRepresentation.email ?: "",
                        firstName = userRepresentation.firstName,
                        lastName = userRepresentation.lastName,
                        realmRoles = rolesToAdd.toMutableList(),
                        note = teamMemberDTO.note,
                        initialStoredAt = LocalDateTime.now(),
                        syncedAt = LocalDateTime.now()
                    )
                    promRepository.findLastActiveProm()
                        .onItem().ifNull().failWith(IllegalStateException("No active Prom found"))
                        .flatMap { activeProm ->
                            teamMember.prom = activeProm
                            repository.persist(teamMember) // Returns Uni<TeamMember>
                        }
                } else {
                    Uni.createFrom().failure<TeamMember>(NotFoundException("User not found in Keycloak."))
                }
            }
            .map { persistedTeamMember: TeamMember ->
                persistedTeamMember.toDetailedDTO()
            }
            .onFailure().invoke { err: Throwable ->
                logger.error("AddTeamMember failed: ${err.message}", err)
            }
    }

    /**
     * Updates roles and notes of an existing TeamMember.
     */
    @WithTransaction
    fun updateTeamMember(id: Long, teamMemberDTO: TeamMemberDTO): Uni<DetailedTeamMemberDTO> {
        val rolesToAssign = teamMemberDTO.realmRoles.filter { !it.startsWith("uma-") }

        return repository.findById(id)
            .flatMap { existingMember: TeamMember? ->
                if (existingMember != null) {
                    val rolesToUnassign = existingMember.realmRoles.filter { !rolesToAssign.contains(it) && !it.startsWith("uma-") }
                    val rolesToAssignFiltered = rolesToAssign.filter { !existingMember.realmRoles.contains(it) }

                    val unassign = if (rolesToUnassign.isNotEmpty()) {
                        keycloakAdminService.assignClientRolesToUser(existingMember.keycloakId, rolesToUnassign)
                    } else {
                        Uni.createFrom().voidItem()
                    }

                    val assign = if (rolesToAssignFiltered.isNotEmpty()) {
                        keycloakAdminService.assignClientRolesToUser(existingMember.keycloakId, rolesToAssignFiltered)
                    } else {
                        Uni.createFrom().voidItem()
                    }

                    unassign
                        .flatMap { assign }
                        .flatMap {
                            existingMember.realmRoles = rolesToAssign.toMutableList()
                            existingMember.note = teamMemberDTO.note
                            existingMember.syncedAt = LocalDateTime.now()
                            repository.persist(existingMember) // Returns Uni<TeamMember>
                        }
                } else {
                    Uni.createFrom().failure<TeamMember>(NotFoundException("TeamMember with id $id not found"))
                }
            }
            .map { updatedTeamMember: TeamMember ->
                updatedTeamMember.toDetailedDTO()
            }
            .onFailure().invoke { err: Throwable ->
                logger.error("UpdateTeamMember failed: ${err.message}", err)
            }
    }

    /**
     * Deletes an existing TeamMember by removing roles from Keycloak and deleting the local entity.
     */
    @WithTransaction
    fun deleteTeamMember(id: Long): Uni<Void> {
        return repository.findById(id)
            .flatMap { existingMember: TeamMember? ->
                if (existingMember != null) {
                    val rolesToUnassign = existingMember.realmRoles.filter { !it.startsWith("uma-") }
                    if (rolesToUnassign.isNotEmpty()) {
                        keycloakAdminService.unassignClientRolesFromUser(existingMember.keycloakId, rolesToUnassign)
                            .flatMap {
                                repository.delete(existingMember)
                            }
                    } else {
                        repository.delete(existingMember)
                    }
                } else {
                    Uni.createFrom().failure<Void>(NotFoundException("TeamMember with id $id not found"))
                }
            }
            .onFailure().invoke { err: Throwable ->
                logger.error("DeleteTeamMember failed: ${err.message}", err)
            }
    }

    /**
     * Retrieves a TeamMember based on the database ID.
     */
    fun getTeamMemberById(id: Long): Uni<DetailedTeamMemberDTO?> {
        return repository.findById(id)
            .map { teamMember: TeamMember? ->
                teamMember?.toDetailedDTO()
            }
    }

    /**
     * Searches TeamMembers based on a query string.
     */
    fun searchUsers(query: String): Uni<List<TeamMemberSearchResultDTO>> {
        return keycloakAdminService.searchUsers(query)
            .map { users ->
                users.map { user ->
                    TeamMemberSearchResultDTO(
                        keycloakId = user.id ?: "",
                        username = user.username ?: "",
                        email = user.email ?: "",
                        firstName = user.firstName,
                        lastName = user.lastName
                    )
                }
            }
            .onFailure().invoke { err: Throwable ->
                logger.error("SearchUsers failed: ${err.message}", err)
            }
            .onFailure().recoverWithItem(emptyList())
    }

    /**
     * Retrieves detailed information of a TeamMember based on the Keycloak ID.
     */
    fun getUserById(keycloakId: String): Uni<DetailedTeamMemberDTO?> {
        return keycloakAdminService.getUserRepresentation(keycloakId)
            .flatMap { userRepresentation: UserRepresentation? ->
                if (userRepresentation != null) {
                    val resolvedKeycloakId = userRepresentation.id ?: ""
                    repository.findByKeycloakId(resolvedKeycloakId)
                        .flatMap { existingMember: TeamMember? ->
                            if (existingMember != null) {
                                Uni.createFrom().item(existingMember)
                            } else {
                                val newTeamMember = TeamMember(
                                    keycloakId = resolvedKeycloakId,
                                    username = userRepresentation.username ?: "",
                                    email = userRepresentation.email ?: "",
                                    firstName = userRepresentation.firstName,
                                    lastName = userRepresentation.lastName,
                                    realmRoles = userRepresentation.realmRoles.filter { !it.startsWith("uma-") }.toMutableList(),
                                    note = "",
                                    initialStoredAt = LocalDateTime.now(),
                                    syncedAt = LocalDateTime.now()
                                )
                                repository.persist(newTeamMember)
                            }
                        }
                } else {
                    Uni.createFrom().nullItem<TeamMember?>()
                }
            }
            .map { teamMember: TeamMember? ->
                teamMember?.toDetailedDTO()
            }
            .onFailure().invoke { err: Throwable ->
                logger.error("GetUserById failed: ${err.message}", err)
            }
    }

    /**
     * Extension function to convert TeamMember to DetailedTeamMemberDTO
     */
    private fun TeamMember.toDetailedDTO(): DetailedTeamMemberDTO = DetailedTeamMemberDTO(
        id = this.id,
        keycloakId = this.keycloakId,
        username = this.username,
        email = this.email,
        firstName = this.firstName,
        lastName = this.lastName,
        realmRoles = this.realmRoles,
        note = this.note,
        initialStoredAt = this.initialStoredAt.toString(),
        syncedAt = this.syncedAt.toString()
    )

    @WithSession
    fun getTeamMembers(): Uni<List<TeamMember>> {
        return promRepository.findLastActiveProm()
            .flatMap { prom ->
                if (prom != null) {
                    repository.list("prom", prom)
                } else {
                    Uni.createFrom().item(emptyList())
                }
            }
    }

    fun removeAllRolesExceptSupervisor(): Uni<Void> {
        val supervisorRoleName = "supervisor"

        return getTeamMembers().flatMap {
            it.forEach { teamMember ->
                val rolesToUnassign = teamMember.realmRoles.filter { it != supervisorRoleName }
                if (rolesToUnassign.isNotEmpty()) {
                    keycloakAdminService.unassignClientRolesFromUser(teamMember.keycloakId, rolesToUnassign)
                        .onFailure().invoke { err: Throwable ->
                            logger.error("RemoveAllRolesExceptSupervisor failed: ${err.message}", err)
                        }
                }
            }
            Uni.createFrom().voidItem()
        }
    }
}