package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.dtos.PromDTO
import at.htlleonding.maturaballmanager.model.entities.Prom
import at.htlleonding.maturaballmanager.repositories.PromRepository
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/prom")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class PromResource {

    @Inject
    lateinit var promRepository: PromRepository

    @GET
    fun getActiveProm(): Uni<Response> {
        return promRepository.findLastActiveProm().onItem().transform { prom ->
            if (prom != null) {
                Response.ok(prom).build()
            } else {
                Response.ok(null).build()
            }
        }
    }

    @POST
    fun createProm(dto: PromDTO): Uni<Response> {
        return promRepository.createProm(dto)
            .onItem().transform { prom ->
                Response.status(Response.Status.CREATED).entity(prom).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.CONFLICT).entity(throwable.message).build()
            }
    }

    @PUT
    @Path("/{id}")
    fun updateProm(@PathParam("id") id: String, dto: PromDTO): Uni<Response> {
        return promRepository.updateProm(id, dto)
            .onItem().transform { prom ->
                Response.ok(prom).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.BAD_REQUEST).entity(throwable.message).build()
            }
    }

    @PUT
    @Path("/{id}/deactivate")
    fun deactivateProm(@PathParam("id") id: String): Uni<Response> {
        return promRepository.deactivateProm(id)
            .onItem().transform { prom ->
                Response.ok(prom).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.BAD_REQUEST).entity(throwable.message).build()
            }
    }
}