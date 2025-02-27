package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.model.dtos.AppointmentDTO
import at.htlleonding.maturaballmanager.model.entities.Appointment
import at.htlleonding.maturaballmanager.model.entities.TeamMember
import at.htlleonding.maturaballmanager.repositories.TeamMemberRepository
import at.htlleonding.maturaballmanager.services.AppointmentService
import io.quarkus.security.Authenticated
import io.smallrye.mutiny.Multi
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.core.SecurityContext
import org.eclipse.microprofile.jwt.JsonWebToken
import java.time.LocalDate

@Path("/appointments")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class AppointmentResource {

    @Inject
    lateinit var appointmentService: AppointmentService

    @Inject
    lateinit var teamMemberRepository: TeamMemberRepository

    @GET
    fun getAppointments(@Context securityContext: SecurityContext): Uni<List<AppointmentDTO>> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        return appointmentService.getAppointments(keycloakId)
            .onItem().transform { appointments ->
                appointments.map { it.toDTO() }
            }
    }

    @GET
    @Path("/byDate")
    fun getAppointmentsForDate(
        @QueryParam("date") date: String,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<List<AppointmentDTO>> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        val parsedDate = try {
            LocalDate.parse(date)
        } catch (e: Exception) {
            throw BadRequestException("Ungültiges Datumsformat. Erwartet wird yyyy-MM-dd")
        }
        val roles = extractClientRoles(jwt)
        return appointmentService.getAppointmentsForDate(keycloakId, parsedDate, roles)
            .onItem().transform { appointments ->
                appointments.map { it.toDTO() }
            }
    }

    @POST
    fun createAppointment(
        appointmentDTO: AppointmentDTO,
        @Context securityContext: SecurityContext
    ): Uni<Response> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")

        return teamMemberRepository.find("keycloakId", keycloakId).firstResult<TeamMember>()
            .onItem().ifNull().failWith {
                WebApplicationException(
                    "Kein TeamMember mit keycloakId $keycloakId gefunden.",
                    Response.Status.BAD_REQUEST
                )
            }
            .flatMap { creator ->
                if (appointmentDTO.endTime != null && appointmentDTO.endTime.isBefore(appointmentDTO.startTime)) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException(
                            "Endzeit darf nicht vor der Startzeit liegen.",
                            Response.Status.BAD_REQUEST
                        )
                    )
                }
                fetchTeamMembers(appointmentDTO.members)
                    .flatMap { validMembers ->
                        val appointment = Appointment(
                            name = appointmentDTO.name,
                            date = appointmentDTO.date,
                            startTime = appointmentDTO.startTime,
                            endTime = appointmentDTO.endTime,
                            creator = creator,
                            members = validMembers.toMutableList()
                        )
                        appointmentService.createAppointment(appointment)
                            .onItem().transform { created ->
                                Response.status(Response.Status.CREATED).entity(created.toDTO()).build()
                            }
                    }
            }
    }

    @PUT
    @Path("/{id}")
    fun updateAppointment(
        @PathParam("id") id: Long,
        appointmentDTO: AppointmentDTO,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        return appointmentService.findById(id)
            .onItem().ifNull().failWith {
                WebApplicationException("Termin nicht gefunden.", Response.Status.NOT_FOUND)
            }
            .flatMap { existing ->
                val roles = extractClientRoles(jwt)
                if (existing?.creator?.keycloakId != keycloakId && !roles.contains("supervisor") && !roles.contains("management")) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException("Keine Berechtigung zum Aktualisieren dieses Termins.", Response.Status.FORBIDDEN)
                    )
                }
                if (appointmentDTO.endTime != null && appointmentDTO.endTime.isBefore(appointmentDTO.startTime)) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException(
                            "Endzeit darf nicht vor der Startzeit liegen.",
                            Response.Status.BAD_REQUEST
                        )
                    )
                }
                fetchTeamMembers(appointmentDTO.members)
                    .flatMap { validMembers ->
                        existing?.name = appointmentDTO.name
                        existing?.date = appointmentDTO.date
                        existing?.startTime = appointmentDTO.startTime
                        existing?.endTime = appointmentDTO.endTime
                        existing?.members = validMembers.toMutableList()
                        appointmentService.updateAppointment(existing!!, existing)
                            .onItem().transform { updated ->
                                Response.ok(updated.toDTO()).build()
                            }
                    }
            }
    }

    @DELETE
    @Path("/{id}")
    fun deleteAppointment(
        @PathParam("id") id: Long,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        return appointmentService.findById(id)
            .onItem().ifNull().failWith {
                WebApplicationException("Termin nicht gefunden.", Response.Status.NOT_FOUND)
            }
            .flatMap { existing ->
                val roles = extractClientRoles(jwt)
                if (existing?.creator?.keycloakId != keycloakId && !roles.contains("supervisor") && !roles.contains("management")) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException("Keine Berechtigung zum Löschen dieses Termins.", Response.Status.FORBIDDEN)
                    )
                }
                appointmentService.deleteAppointment(existing!!)
                    .onItem().transform { _ ->
                        Response.noContent().build()
                    }
            }
    }

    private fun fetchTeamMembers(memberDTOs: List<at.htlleonding.maturaballmanager.model.dtos.SmallTeamMemberDTO>): Uni<List<TeamMember>> {
        return Multi.createFrom().iterable(memberDTOs)
            .onItem().transformToUni { dto ->
                teamMemberRepository.findById(dto.id).onItem().ifNull().failWith {
                    WebApplicationException("Kein TeamMember mit ID ${dto.id} gefunden.", Response.Status.BAD_REQUEST)
                }
            }.merge().collect().asList()
    }

    private fun extractClientRoles(jwt: JsonWebToken): List<String> {
        val resourceAccess = jwt.claim<Any>("resource_access")?.get() as? Map<*, *>
        val leoballAccess = resourceAccess?.get("leoball") as? Map<*, *>
        val roles = leoballAccess?.get("roles") as? List<*> ?: emptyList<Any>()
        return roles.filterIsInstance<String>()
    }
}