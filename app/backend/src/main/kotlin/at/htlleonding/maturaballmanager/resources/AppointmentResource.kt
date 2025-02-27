package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.model.dtos.AppointmentDTO
import at.htlleonding.maturaballmanager.model.entities.Appointment
import at.htlleonding.maturaballmanager.model.entities.TeamMember
import at.htlleonding.maturaballmanager.repositories.TeamMemberRepository
import at.htlleonding.maturaballmanager.services.AppointmentService
import io.smallrye.mutiny.Uni
import io.quarkus.security.Authenticated
import org.eclipse.microprofile.jwt.JsonWebToken
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.core.SecurityContext
import org.eclipse.microprofile.jwt.Claim
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

    /**
     * GET: Liefert alle Termine, die für den aktuell angemeldeten Nutzer verfügbar sind.
     */
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
        @Context securityContext: SecurityContext
    ): Uni<List<AppointmentDTO>> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        val parsedDate = try {
            LocalDate.parse(date)
        } catch (e: Exception) {
            throw BadRequestException("Ungültiges Datumsformat. Erwartet wird yyyy-MM-dd")
        }
        return appointmentService.getAppointmentsForDate(keycloakId, parsedDate)
            .onItem().transform { appointments ->
                appointments.map { it.toDTO() }
            }
    }


    /**
     * POST: Erstellt einen neuen Termin.
     * Validiert, dass falls eine Endzeit gesetzt wurde, diese nicht vor der Startzeit liegt.
     */
    @POST
    fun createAppointment(
        appointment: Appointment,
        @Context securityContext: SecurityContext
    ): Uni<Response> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")

        // Reaktiv: Lade den Ersteller als TeamMember anhand der keycloakId
        return teamMemberRepository.find("keycloakId", keycloakId).firstResult<TeamMember>()
            .onItem().ifNull().failWith { WebApplicationException("Kein TeamMember mit keycloakId $keycloakId gefunden.", Response.Status.BAD_REQUEST) }
            .flatMap { creator ->
                appointment.creator = creator

                appointment.endTime?.let { end ->
                    if (end.isBefore(appointment.startTime)) {
                        return@flatMap Uni.createFrom().failure<Response>(
                            WebApplicationException("Endzeit darf nicht vor der Startzeit liegen.", Response.Status.BAD_REQUEST)
                        )
                    }
                }
                appointmentService.createAppointment(appointment)
                    .onItem().transform { created ->
                        Response.status(Response.Status.CREATED).entity(created.toDTO()).build()
                    }
            }
    }

    /**
     * PUT: Aktualisiert einen bestehenden Termin.
     * PUT ist nur erlaubt, wenn der aktuelle Nutzer der Ersteller ist oder
     * wenn er die Rolle "supervisor" bzw. "management" (client role im Client "leoball") besitzt.
     */
    @PUT
    @Path("/{id}")
    fun updateAppointment(
        @PathParam("id") id: Long,
        updatedAppointment: Appointment,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        val keycloakId = securityContext.userPrincipal?.name
            ?: throw NotAuthorizedException("Kein gültiger Nutzer")

        return appointmentService.findById(id)
            .onItem().ifNull().failWith { WebApplicationException("Termin nicht gefunden.", Response.Status.NOT_FOUND) }
            .flatMap { existing ->
                val roles = extractClientRoles(jwt)
                if (existing?.creator?.keycloakId != keycloakId && !roles.contains("supervisor") && !roles.contains("management")) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException("Keine Berechtigung zum Aktualisieren dieses Termins.", Response.Status.FORBIDDEN)
                    )
                }

                updatedAppointment.endTime?.let { end ->
                    if (end.isBefore(updatedAppointment.startTime)) {
                        return@flatMap Uni.createFrom().failure<Response>(
                            WebApplicationException("Endzeit darf nicht vor der Startzeit liegen.", Response.Status.BAD_REQUEST)
                        )
                    }
                }
                appointmentService.updateAppointment(existing!!, updatedAppointment)
                    .onItem().transform { updated ->
                        Response.ok(updated.toDTO()).build()
                    }
            }
    }

    /**
     * DELETE: Löscht einen Termin.
     * DELETE ist nur erlaubt, wenn der aktuelle Nutzer der Ersteller ist oder
     * wenn er die Rolle "supervisor" bzw. "management" (client role im Client "leoball") besitzt.
     */
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
            .onItem().ifNull().failWith { WebApplicationException("Termin nicht gefunden.", Response.Status.NOT_FOUND) }
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

    /**
     * Extrahiert die Client Roles aus dem JWT.
     * Erwartet den Claim "resource_access" mit einem Objekt, das für den Client "leoball" die Rollen enthält.
     */
    private fun extractClientRoles(jwt: JsonWebToken): List<String> {
        val resourceAccess = jwt.claim<Claim>("resource_access")?.get() as? Map<*, *>
        val leoballAccess = resourceAccess?.get("leoball") as? Map<*, *>
        val roles = leoballAccess?.get("roles") as? List<*> ?: emptyList<Any>()
        return roles.filterIsInstance<String>()
    }
}
