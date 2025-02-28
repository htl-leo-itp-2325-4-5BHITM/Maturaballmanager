package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.model.dtos.AppointmentRequest
import at.htlleonding.maturaballmanager.model.dtos.AppointmentResponse
import at.htlleonding.maturaballmanager.model.entities.Appointment
import at.htlleonding.maturaballmanager.model.entities.TeamMember
import at.htlleonding.maturaballmanager.repositories.TeamMemberRepository
import at.htlleonding.maturaballmanager.services.AppointmentService
import io.quarkus.security.Authenticated
import io.smallrye.mutiny.Multi
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.ws.rs.BadRequestException
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.NotAuthorizedException
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.WebApplicationException
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.core.SecurityContext
import org.eclipse.microprofile.jwt.JsonWebToken
import java.time.LocalDate
import java.time.LocalTime

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
    fun getAppointments(@Context securityContext: SecurityContext): Uni<List<AppointmentResponse>> {
        val keycloakId = securityContext.userPrincipal?.name ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        return appointmentService.getAppointments(keycloakId)
            .onItem().transform<List<AppointmentResponse>> { appointments: List<Appointment> ->
                appointments.map { it.toDTO() }
            }
    }

    @GET
    @Path("/byDate")
    fun getAppointmentsForDate(
        @QueryParam("date") date: String,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<List<AppointmentResponse>> {
        val keycloakId = jwt.subject ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        val parsedDate = try {
            LocalDate.parse(date)
        } catch (e: Exception) {
            throw BadRequestException("Ungültiges Datumsformat. Erwartet wird yyyy-MM-dd")
        }
        val roles = extractClientRoles(jwt)
        return appointmentService.getAppointmentsForDate(keycloakId, parsedDate, roles)
            .onItem().transform<List<AppointmentResponse>> { appointments: List<Appointment> ->
                appointments.map { it.toDTO() }
            }
    }

<<<<<<< HEAD
=======
    /**
     * POST: Erstellt einen neuen Termin.
     * Validiert, dass falls eine Endzeit gesetzt wurde, diese nicht vor der Startzeit liegt.
     */
>>>>>>> a6ee574f (changes)
    @POST
    fun createAppointment(
        appointmentRequest: AppointmentRequest,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        val keycloakId = jwt.subject ?: throw NotAuthorizedException("Kein gültiger Nutzer")

        return teamMemberRepository.find("keycloakId", keycloakId).firstResult<TeamMember>()
            .onItem().ifNull().failWith {
                WebApplicationException("Kein TeamMember mit keycloakId $keycloakId gefunden.", Response.Status.BAD_REQUEST)
            }
            .flatMap { creator ->
                val localDate = try {
                    LocalDate.parse(appointmentRequest.date)
                } catch (e: Exception) {
                    throw BadRequestException("Ungültiges Datumsformat. Erwartet wird yyyy-MM-dd")
                }
                val localStartTime = if (!appointmentRequest.startTime.isNullOrBlank())
                    LocalTime.parse(appointmentRequest.startTime) else null
                val localEndTime = if (!appointmentRequest.endTime.isNullOrBlank())
                    LocalTime.parse(appointmentRequest.endTime) else null

                // Validierung: Nur wenn beide Zeiten vorhanden sind, prüfen wir, ob endTime vor startTime liegt
                if (localStartTime != null && localEndTime != null && localEndTime.isBefore(localStartTime)) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException("Endzeit darf nicht vor der Startzeit liegen.", Response.Status.BAD_REQUEST)
                    )
                }
                if (appointmentRequest.members.isNotEmpty()) {
                    val memberUnis = appointmentRequest.members.map { memberDTO ->
                        teamMemberRepository.findById(memberDTO.id)
                            .onItem().ifNull().failWith(
                                WebApplicationException("Kein TeamMember mit ID ${memberDTO.id} gefunden.", Response.Status.BAD_REQUEST)
                            )
                    }
                    Multi.createFrom().iterable(memberUnis)
                        .flatMap<TeamMember> { uni: Uni<TeamMember> -> uni.toMulti() }
                        .collect().asList()
                        .flatMap { validMembers ->
                            val appointment = Appointment(
                                name = appointmentRequest.name,
                                date = localDate,
                                startTime = localStartTime,
                                endTime = localEndTime,
                                creator = creator,
                                members = validMembers.toMutableList()
                            )
                            appointmentService.createAppointment(appointment)
                                .onItem().transform { created ->
                                    Response.status(Response.Status.CREATED).entity(created.toDTO()).build()
                                }
                        }
                } else {
                    // Falls keine Mitglieder angegeben sind
                    val appointment = Appointment(
                        name = appointmentRequest.name,
                        date = localDate,
                        startTime = localStartTime,
                        endTime = localEndTime,
                        creator = creator
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
        appointmentRequest: AppointmentRequest,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        val keycloakId = jwt.subject ?: throw NotAuthorizedException("Kein gültiger Nutzer")
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
                val localDate = try {
                    LocalDate.parse(appointmentRequest.date)
                } catch (e: Exception) {
                    throw BadRequestException("Ungültiges Datumsformat. Erwartet wird yyyy-MM-dd")
                }
                val localStartTime = if (!appointmentRequest.startTime.isNullOrBlank()) LocalTime.parse(appointmentRequest.startTime) else null
                val localEndTime = if (!appointmentRequest.endTime.isNullOrBlank()) LocalTime.parse(appointmentRequest.endTime) else null

                if (localStartTime != null && localEndTime != null && localEndTime.isBefore(localStartTime)) {
                    return@flatMap Uni.createFrom().failure<Response>(
                        WebApplicationException("Endzeit darf nicht vor der Startzeit liegen.", Response.Status.BAD_REQUEST)
                    )
                }
                val memberUnis = appointmentRequest.members.map { memberDTO ->
                    teamMemberRepository.findById(memberDTO.id)
                        .onItem().ifNull().failWith(
                            WebApplicationException("Kein TeamMember mit ID ${memberDTO.id} gefunden.", Response.Status.BAD_REQUEST)
                        )
                }
                Multi.createFrom().iterable(memberUnis)
                    .flatMap<TeamMember> { uni: Uni<TeamMember> -> uni.toMulti() }
                    .collect().asList()
                    .flatMap { validMembers ->
                        existing?.name = appointmentRequest.name
                        existing?.date = localDate
                        existing?.startTime = localStartTime
                        existing?.endTime = localEndTime
                        existing?.members = validMembers.toMutableList()
                        existing?.let {
                            appointmentService.updateAppointment(it, existing)
                                .onItem().transform { updated ->
                                    Response.ok(updated.toDTO()).build()
                                }
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
        val keycloakId = securityContext.userPrincipal?.name ?: throw NotAuthorizedException("Kein gültiger Nutzer")
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
                existing.let {
                    appointmentService.deleteAppointment(existing!!)
                        .onItem().transform { _ ->
                            Response.noContent().build()
                        }
                }
            }
    }

    private fun extractClientRoles(jwt: JsonWebToken): List<String> {
        val resourceAccess = jwt.claim<Any>("resource_access")?.get() as? Map<*, *>
        val leoballAccess = resourceAccess?.get("leoball") as? Map<*, *>
        val roles = leoballAccess?.get("roles") as? List<*> ?: emptyList<Any>()
        return roles.filterIsInstance<String>()
    }
}