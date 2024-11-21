package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.entities.Benefit
import at.htlleonding.maturaballmanager.repositories.BenefitRepository
import jakarta.inject.Inject
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import jakarta.validation.Valid
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/benefit")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class BenefitResource {

    @Inject
    lateinit var benefitRepository: BenefitRepository

    /**
     * GET /benefit
     * Liefert alle Gegenleistungen.
     */
    @GET
    fun getAllBenefits(): List<Benefit> {
        return benefitRepository.getAll()
    }

    /**
     * GET /benefit/{id}
     * Liefert eine spezifische Gegenleistung anhand der ID.
     */
    @GET
    @Path("/{id}")
    fun getBenefitById(@PathParam("id") id: String): Response {
        val benefit = benefitRepository.getById(id)
        return if (benefit != null) {
            Response.ok(benefit).build()
        } else {
            Response.status(Response.Status.NOT_FOUND).entity("Benefit not found").build()
        }
    }

    /**
     * POST /benefit
     * Erstellt eine neue Gegenleistung.
     */
    @POST
    @Transactional
    fun createBenefit(@Valid benefit: Benefit): Response {
        benefitRepository.create(benefit)
        return Response.status(Response.Status.CREATED).entity(benefit).build()
    }

    /**
     * PUT /benefit/{id}
     * Aktualisiert eine bestehende Gegenleistung.
     */
    @PUT
    @Transactional
    fun updateBenefit(@Valid updatedBenefit: Benefit): Response {
        return try {
            benefitRepository.update(updatedBenefit)
            Response.ok(updatedBenefit).build()
        } catch (e: EntityNotFoundException) {
            Response.status(Response.Status.NOT_FOUND).entity("Benefit not found").build()
        } catch (e: Exception) {
            Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error updating benefit: ${e.message}").build()
        }
    }

    /**
     * DELETE /benefit/{id}
     * Löscht eine Gegenleistung anhand der ID.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    fun deleteBenefit(@PathParam("id") id: String): Response {
        return try {
            benefitRepository.delete(id)
            Response.ok().build()
        } catch (e: EntityNotFoundException) {
            Response.status(Response.Status.NOT_FOUND).entity("Benefit not found").build()
        } catch (e: Exception) {
            Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error deleting benefit: ${e.message}").build()
        }
    }
}