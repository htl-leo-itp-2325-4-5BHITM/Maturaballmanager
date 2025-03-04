package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.model.dtos.AppointmentRequest
import at.htlleonding.maturaballmanager.model.dtos.AppointmentResponse
import at.htlleonding.maturaballmanager.services.AppointmentService
import io.quarkus.security.Authenticated
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

@Path("/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class AppointmentResource {

    @Inject
    lateinit var appointmentService: AppointmentService

    @GET
    fun getAppointments(@Context securityContext: SecurityContext): Uni<List<AppointmentResponse>> {
        return appointmentService.getAllAppointments()
    }

    @GET
    @Path("/byDate")
    fun getAppointmentsForDate(
        @QueryParam("date") date: String,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<List<AppointmentResponse>> {
        return appointmentService.getAppointmentsByDate(date)
    }

    @POST
    fun createAppointment(
        appointmentRequest: AppointmentRequest,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        println(jwt.subject)
        val userId = jwt.subject.takeIf { it != null } ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        val requestWithUser = appointmentRequest.copy(creatorId = userId)

        // Lokale Variablen erzeugen
        val startTime = requestWithUser.startTime
        val endTime = requestWithUser.endTime

        if (startTime != null && endTime != null && endTime.isBefore(startTime)) {
            throw BadRequestException("Endzeit darf nicht vor der Startzeit liegen.")
        }

        return appointmentService.createAppointment(requestWithUser)
            .onItem().transform { created ->
                Response.status(Response.Status.CREATED).entity(created).build()
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
        val userId = jwt.subject.takeIf { it != null } ?: throw NotAuthorizedException("Kein gültiger Nutzer")
        val requestWithUser = appointmentRequest.copy(creatorId = userId)

        // Lokale Variablen erzeugen
        val startTime = requestWithUser.startTime
        val endTime = requestWithUser.endTime

        if (startTime != null && endTime != null && endTime.isBefore(startTime)) {
            throw BadRequestException("Endzeit darf nicht vor der Startzeit liegen.")
        }

        return appointmentService.updateAppointment(id, requestWithUser)
            .onItem().transform { updated ->
                Response.ok(updated).build()
            }
    }

    @DELETE
    @Path("/{id}")
    fun deleteAppointment(
        @PathParam("id") id: Long,
        @Context securityContext: SecurityContext,
        @Context jwt: JsonWebToken
    ): Uni<Response> {
        return appointmentService.deleteAppointment(id)
            .onItem().transform {
                Response.noContent().build()
            }
    }
}