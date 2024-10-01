// src/main/kotlin/at/htlleonding/maturaballmanager/resources/CompanyResource.kt
package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.entities.Company
import at.htlleonding.maturaballmanager.repositories.CompanyRepository
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/company")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CompanyResource {

    @Inject
    lateinit var companyRepository: CompanyRepository

    /**
     * GET /company
     * Liefert alle Unternehmen.
     */
    @GET
    fun getAllCompanies(): List<Company> {
        return companyRepository.getAllCompanies()
    }

    /**
     * GET /company/{id}
     * Liefert ein spezifisches Unternehmen anhand der ID.
     */
    @GET
    @Path("/{id}")
    fun getCompanyById(@PathParam("id") id: String): Response {
        val company = companyRepository.getById(id)
        return if (company != null) {
            Response.ok(company).build()
        } else {
            Response.status(Response.Status.NOT_FOUND).entity("Company not found").build()
        }
    }

    /**
     * POST /company
     * Erstellt ein neues Unternehmen.
     */
    @POST
    fun createCompany(company: Company): Response {
        return try {
            val createdCompany = companyRepository.create(company)
            Response.status(Response.Status.CREATED).entity(createdCompany).build()
        } catch (e: Exception) {
            Response.serverError().entity(e.message).build()
        }
    }

    /**
     * PUT /company/{id}
     * Aktualisiert ein bestehendes Unternehmen.
     */
    @PUT
    @Path("/{id}")
    fun updateCompany(@PathParam("id") id: String, updatedCompany: Company): Response {
        val existingCompany = companyRepository.getById(id)
        return if (existingCompany != null) {
            updatedCompany.id = existingCompany.id
            return try {
                val mergedCompany = companyRepository.update(updatedCompany)
                Response.ok(mergedCompany).build()
            } catch (e: Exception) {
                Response.serverError().entity(e.message).build()
            }
        } else {
            Response.status(Response.Status.NOT_FOUND).entity("Company not found").build()
        }
    }

    /**
     * DELETE /company/{id}
     * Löscht ein Unternehmen anhand der ID.
     */
    @DELETE
    @Path("/{id}")
    fun deleteCompany(@PathParam("id") id: String): Response {
        val company = companyRepository.getById(id)
        return if (company != null) {
            return try {
                companyRepository.delete(id)
                Response.ok().build()
            } catch (e: Exception) {
                Response.serverError().entity(e.message).build()
            }
        } else {
            Response.status(Response.Status.NOT_FOUND).entity("Company not found").build()
        }
    }

    /**
     * POST /company/bulk-delete
     * Löscht mehrere Unternehmen anhand einer Liste von IDs.
     */
    @POST
    @Path("/bulk-delete")
    fun deleteCompanies(ids: List<String>): Response {
        if (ids.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("No IDs provided").build()
        }
        return try {
            Response.ok().build()
        } catch (e: Exception) {
            Response.serverError().entity(e.message).build()
        }
    }

    /**
     * GET /company/{id}/contact-persons
     * Liefert alle Ansprechpartner eines Unternehmens anhand der ID.
     */
    @GET
    @Path("/{id}/contact-persons")
    fun getContactPersonsByCompanyId(@PathParam("id") id: String): Response {
        return Response.ok(companyRepository.getContactPersons(id)).build();
    }
}