package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.dtos.DetailedTeamMemberDTO
import at.htlleonding.maturaballmanager.model.dtos.TeamMemberDTO
import at.htlleonding.maturaballmanager.model.dtos.TeamMemberSearchResultDTO
import at.htlleonding.maturaballmanager.services.TeamMemberService
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/team-members")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class TeamMemberResource {

    @Inject
    lateinit var service: TeamMemberService

    /**
     * Fügt einen neuen TeamMember hinzu.
     */
    @POST
    fun addTeamMember(teamMemberDTO: TeamMemberDTO): Uni<Response> {
        return service.addTeamMember(teamMemberDTO)
            .onItem().transform { teamMember ->
                Response.status(Response.Status.CREATED).entity(teamMember).build()
            }
            .onFailure().recoverWithItem { e ->
                Response.status(Response.Status.BAD_REQUEST).entity(mapOf("error" to e.message)).build()
            }
    }

    /**
     * Aktualisiert einen bestehenden TeamMember.
     */
    @PUT
    @Path("/{id}")
    fun updateTeamMember(@PathParam("id") id: Long, teamMemberDTO: TeamMemberDTO): Uni<Response> {
        return service.updateTeamMember(id, teamMemberDTO)
            .onItem().transform { teamMember ->
                Response.ok(teamMember).build()
            }
            .onFailure().recoverWithItem { e ->
                when (e) {
                    is NotFoundException -> Response.status(Response.Status.NOT_FOUND).entity(mapOf("error" to e.message)).build()
                    else -> Response.status(Response.Status.BAD_REQUEST).entity(mapOf("error" to e.message)).build()
                }
            }
    }

    /**
     * Löscht einen bestehenden TeamMember.
     */
    @DELETE
    @Path("/{id}")
    fun deleteTeamMember(@PathParam("id") id: Long): Uni<Response> {
        return service.deleteTeamMember(id)
            .onItem().transform {
                Response.noContent().build()
            }
            .onFailure().recoverWithItem { e ->
                when (e) {
                    is NotFoundException -> Response.status(Response.Status.NOT_FOUND).entity(mapOf("error" to e.message)).build()
                    else -> Response.status(Response.Status.BAD_REQUEST).entity(mapOf("error" to e.message)).build()
                }
            }
    }

    /**
     * Holt einen TeamMember basierend auf der Datenbank-ID.
     */
    @GET
    @Path("/{id}")
    fun getTeamMember(@PathParam("id") id: Long): Uni<Response> {
        return service.getTeamMemberById(id)
            .onItem().transform { teamMember ->
                if (teamMember != null) {
                    Response.ok(teamMember).build()
                } else {
                    Response.status(Response.Status.NOT_FOUND).entity(mapOf("error" to "TeamMember nicht gefunden")).build()
                }
            }
            .onFailure().recoverWithItem { e ->
                Response.status(Response.Status.BAD_REQUEST).entity(mapOf("error" to e.message)).build()
            }
    }

    /**
     * Sucht TeamMembers basierend auf einem Suchbegriff.
     */
    @GET
    fun searchTeamMembers(@QueryParam("query") query: String): Uni<Response> {
        return service.searchUsers(query)
            .onItem().transform { users ->
                Response.ok(users).build()
            }
            .onFailure().recoverWithItem { e ->
                Response.status(Response.Status.BAD_REQUEST).entity(mapOf("error" to e.message)).build()
            }
    }

    @GET
    @Path("/{keycloakId}")
    fun getDetails(@PathParam("keycloakId") keycloakId: String): Uni<Response> {
        return service.getUserById(keycloakId)
            .onItem().transform { user: DetailedTeamMemberDTO? ->
                if (user == null) {
                    Response.status(Response.Status.NOT_FOUND).entity("User not found").build()
                } else {
                    Response.ok(user).build()
                }
            }
    }

    @GET
    @Path("/team")
    fun getTeamMembers(): Uni<Response> {
        return service.getTeamMembers()
            .onItem().transform { teamMembers ->
                Response.ok(teamMembers).build()
            }
            .onFailure().recoverWithItem { e ->
                Response.status(Response.Status.BAD_REQUEST).entity(mapOf("error" to e.message)).build()
            }
    }
}
