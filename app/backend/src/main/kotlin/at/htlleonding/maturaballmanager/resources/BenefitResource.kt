package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.configs.toEntity
import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.model.dtos.BenefitDTO
import at.htlleonding.maturaballmanager.repositories.BenefitRepository
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.persistence.EntityNotFoundException
import jakarta.validation.ConstraintViolationException
import jakarta.validation.Valid
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import net.bytebuddy.pool.TypePool.Resolution.Illegal

@Path("/benefit")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class BenefitResource {

    @Inject
    lateinit var benefitRepository: BenefitRepository

    /**
     * GET /benefit
     * Retrieves all benefits as DTOs.
     */
    @GET
    fun getAllBenefits(): Uni<Response> {
        return benefitRepository.getAll()
            .map { benefits ->
                val benefitDTOs = benefits.map { it.toDTO() }
                Response.ok(benefitDTOs).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching benefits: ${throwable.message}")
                    .build()
            }
    }

    /**
     * GET /benefit/{id}
     * Retrieves a specific benefit by ID as a DTO.
     */
    @GET
    @Path("/{id}")
    fun getBenefitById(@PathParam("id") id: String): Uni<Response> {
        return benefitRepository.getById(id)
            .map { benefit ->
                if (benefit != null) {
                    Response.ok(benefit.toDTO()).build()
                } else {
                    Response.status(Response.Status.NOT_FOUND)
                        .entity("Benefit not found")
                        .build()
                }
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching benefit: ${throwable.message}")
                    .build()
            }
    }

    /**
     * POST /benefit
     * Creates a new benefit from a DTO.
     */
    @POST
    fun createBenefit(@Valid benefitDTO: BenefitDTO): Uni<Response> {
        val benefitEntity = benefitDTO.toEntity()
        return benefitRepository.create(benefitEntity)
            .map { createdBenefit ->
                Response.status(Response.Status.CREATED)
                    .entity(createdBenefit.toDTO())
                    .build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is ConstraintViolationException -> {
                        val errors = throwable.constraintViolations.map { it.message }
                        Response.status(Response.Status.BAD_REQUEST)
                            .entity(errors)
                            .build()
                    }
                    else -> {
                        Response.serverError()
                            .entity("Error creating benefit: ${throwable.message}")
                            .build()
                    }
                }
            }
    }

    /**
     * PUT /benefit
     * Updates an existing benefit using a DTO.
     */
    @PUT
    fun updateBenefit(@Valid updatedBenefitDTO: BenefitDTO): Uni<Response> {
        println(updatedBenefitDTO)
        val benefitEntity = updatedBenefitDTO.toEntity()
        println(benefitEntity)
        return benefitRepository.update(benefitEntity)
            .map { mergedBenefit ->
                Response.ok(mergedBenefit.toDTO()).build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    is IllegalStateException -> {
                        val error = throwable.message
                        Response.status(Response.Status.BAD_REQUEST)
                            .entity(error)
                            .build()
                    }
                    else -> {
                        Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                            .entity("Error updating benefit: ${throwable.message}")
                            .build()
                    }
                }
            }
    }

    /**
     * DELETE /benefit/{id}
     * Deletes a benefit by ID.
     */
    @DELETE
    @Path("/{id}")
    fun deleteBenefit(@PathParam("id") id: String): Uni<Response>? {
        return benefitRepository.delete(id)
            ?.map {
                Response.noContent().build()
            }
            ?.onFailure()?.recoverWithItem { throwable ->
                when (throwable) {
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity("Benefit not found")
                            .build()
                    }
                    is IllegalStateException -> {
                        Response.status(Response.Status.BAD_REQUEST)
                            .entity(throwable.message)
                            .build()
                    }
                    else -> {
                        Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                            .entity("Error deleting benefit: ${throwable.message}")
                            .build()
                    }
                }
            }
    }
}