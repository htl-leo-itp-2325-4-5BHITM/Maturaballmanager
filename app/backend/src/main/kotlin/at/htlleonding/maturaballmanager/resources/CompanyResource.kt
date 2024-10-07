// src/main/kotlin/at/htlleonding/maturaballmanager/resources/CompanyResource.kt
package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.entities.Company
import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import at.htlleonding.maturaballmanager.repositories.CompanyRepository
import at.htlleonding.maturaballmanager.repositories.ContactPersonRepository
import jakarta.inject.Inject
import jakarta.validation.ConstraintViolationException
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/company")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CompanyResource {

    @Inject
    lateinit var companyRepository: CompanyRepository

    @Inject
    lateinit var contactPersonRepository: ContactPersonRepository

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

    @POST
    fun createCompany(company: Company): Response {
        return try {
            val createdCompany = companyRepository.create(company)
            Response.status(Response.Status.CREATED).entity(createdCompany).build()
        } catch (e: ConstraintViolationException) {
            val errors = e.constraintViolations.map { it.message }
            Response.status(Response.Status.BAD_REQUEST).entity(errors).build()
        } catch (e: Exception) {
            Response.serverError().entity(e.message).build()
        }
    }

    @PUT
    @Path("/{id}")
    fun updateCompany(@PathParam("id") id: String, updatedCompany: Company): Response {
        val existingCompany = companyRepository.getById(id)
        return if (existingCompany != null) {
            updatedCompany.id = existingCompany.id
            return try {
                val mergedCompany = companyRepository.update(updatedCompany)
                Response.ok(mergedCompany).build()
            } catch (e: ConstraintViolationException) {
                val errors = e.constraintViolations.map { it.message }
                Response.status(Response.Status.BAD_REQUEST).entity(errors).build()
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

    /**
     * POST /company/{id}/contact-persons
     * Fügt eine neue Kontaktperson zu einem Unternehmen hinzu.
     */
    @POST
    @Path("/{id}/contact-persons")
    fun addContactPerson(@PathParam("id") companyId: String, contactPerson: ContactPerson): Response {
        return try {
            val company = companyRepository.getById(companyId)
                ?: return Response.status(Response.Status.NOT_FOUND).entity("Company not found").build()

            contactPerson.company = company
            val createdContactPerson = contactPersonRepository.create(contactPerson)
            Response.status(Response.Status.CREATED).entity(createdContactPerson).build()
        } catch (e: ConstraintViolationException) {
            val errors = e.constraintViolations.map { it.message }
            Response.status(Response.Status.BAD_REQUEST).entity(errors).build()
        } catch (e: Exception) {
            Response.serverError().entity(e.message).build()
        }
    }

    /**
     * PUT /company/{companyId}/contact-persons/{contactPersonId}
     * Aktualisiert eine Kontaktperson.
     */
    @PUT
    @Path("/{companyId}/contact-persons/{contactPersonId}")
    fun updateContactPerson(
        @PathParam("companyId") companyId: String,
        @PathParam("contactPersonId") contactPersonId: String,
        updatedContactPerson: ContactPerson
    ): Response {
        return try {
            val existingContactPerson = contactPersonRepository.getById(contactPersonId)

            if (existingContactPerson?.company?.id != companyId) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Contact person does not belong to the company").build()
            }

            updatedContactPerson.id = existingContactPerson.id
            updatedContactPerson.company = existingContactPerson.company

            val mergedContactPerson = contactPersonRepository.update(updatedContactPerson)
            Response.ok(mergedContactPerson).build()
        } catch (e: ConstraintViolationException) {
            val errors = e.constraintViolations.map { it.message }
            Response.status(Response.Status.BAD_REQUEST).entity(errors).build()
        } catch (e: Exception) {
            Response.serverError().entity(e.message).build()
        }
    }


    /**
     * DELETE /contact-person/{id}
     * Deletes a contact person.
     */
    @DELETE
    @Path("/contact-person/{id}")
    fun deleteContactPerson(@PathParam("id") contactPersonId: String): Response {
        return try {
            contactPersonRepository.delete(contactPersonId)
            Response.ok().build()
        } catch (e: Exception) {
            Response.serverError().entity(e.message).build()
        }
    }
}