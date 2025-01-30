package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.entities.Company
import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import at.htlleonding.maturaballmanager.repositories.CompanyRepository
import at.htlleonding.maturaballmanager.repositories.ContactPersonRepository
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.persistence.EntityNotFoundException
import jakarta.validation.ConstraintViolationException
import jakarta.validation.Valid
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
    fun getAllCompanies(): Uni<Response> {
        return companyRepository.getAllCompanies()
            .map { companies ->
                Response.ok(companies).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching companies: ${throwable.message}")
                    .build()
            }
    }

    /**
     * GET /company/{id}
     * Liefert ein spezifisches Unternehmen anhand der ID.
     */
    @GET
    @Path("/{id}")
    fun getCompanyById(@PathParam("id") id: String): Uni<Response> {
        return companyRepository.getById(id)
            .map { company ->
                if (company != null) {
                    Response.ok(company).build()
                } else {
                    Response.status(Response.Status.NOT_FOUND)
                        .entity("Company not found")
                        .build()
                }
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching company: ${throwable.message}")
                    .build()
            }
    }

    /**
     * POST /company
     * Erstellt ein neues Unternehmen.
     */
    @POST
    fun createCompany(@Valid company: Company): Uni<Response> {
        return companyRepository.create(company)
            .map { createdCompany ->
                Response.status(Response.Status.CREATED)
                    .entity(createdCompany)
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
                            .entity("Error creating company: ${throwable.message}")
                            .build()
                    }
                }
            }
    }

    /**
     * PUT /company/{id}
     * Aktualisiert ein bestehendes Unternehmen.
     */
    @PUT
    @Path("/{id}")
    fun updateCompany(@PathParam("id") id: String, @Valid updatedCompany: Company): Uni<Response> {
        updatedCompany.id = id
        return companyRepository.update(updatedCompany)
            .map { mergedCompany ->
                Response.ok(mergedCompany).build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is ConstraintViolationException -> {
                        val errors = throwable.constraintViolations.map { it.message }
                        Response.status(Response.Status.BAD_REQUEST)
                            .entity(errors)
                            .build()
                    }
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    else -> {
                        Response.serverError()
                            .entity("Error updating company: ${throwable.message}")
                            .build()
                    }
                }
            }
    }

    /**
     * DELETE /company/{id}
     * Löscht ein Unternehmen anhand der ID.
     */
    @DELETE
    @Path("/{id}")
    fun deleteCompany(@PathParam("id") id: String): Uni<Response> {
        return companyRepository.delete(id)
            .map {
                // If delete is successful, return 204 No Content
                Response.noContent().build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    else -> {
                        val rootCause = getRootCause(throwable)
                        if (rootCause is java.sql.SQLException && rootCause.sqlState == "23503") {
                            Response.status(Response.Status.CONFLICT)
                                .entity("Unternehmen kann nicht gelöscht werden, da noch Rechnungen vorhanden sind.")
                                .build()
                        } else {
                            Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                .entity("Error deleting company: ${rootCause.message ?: throwable.message}")
                                .build()
                        }
                    }
                }
            }
    }

    private fun getRootCause(t: Throwable?): Throwable {
        var result = t
        while (result?.cause != null && result.cause != result) {
            result = result.cause
        }
        return result ?: RuntimeException("No root cause found")
    }

    /**
     * GET /company/{id}/contact-persons
     * Liefert alle Ansprechpartner eines Unternehmens anhand der ID.
     */
    @GET
    @Path("/{id}/contact-persons")
    fun getContactPersonsByCompanyId(@PathParam("id") id: String): Uni<Response> {
        return contactPersonRepository.getByCompanyId(id)
            .map { contactPersons ->
                Response.ok(contactPersons).build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    else -> {
                        Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                            .entity("Error fetching contact persons: ${throwable.message}")
                            .build()
                    }
                }
            }
    }

    /**
     * POST /company/{id}/contact-persons
     * Fügt eine neue Kontaktperson zu einem Unternehmen hinzu.
     */
    @POST
    @Path("/{id}/contact-persons")
    fun addContactPerson(@PathParam("id") companyId: String, @Valid contactPerson: ContactPerson): Uni<Response> {
        return companyRepository.getById(companyId)
            .flatMap { company ->
                if (company != null) {
                    contactPerson.company = company
                    contactPersonRepository.create(contactPerson)
                } else {
                    Uni.createFrom().failure<EntityNotFoundException>(EntityNotFoundException("Company not found"))
                }
            }
            .map { createdContactPerson ->
                Response.status(Response.Status.CREATED)
                    .entity(createdContactPerson)
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
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    else -> {
                        Response.serverError()
                            .entity("Error adding contact person: ${throwable.message}")
                            .build()
                    }
                }
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
        @Valid updatedContactPerson: ContactPerson
    ): Uni<Response> {
        return contactPersonRepository.getById(contactPersonId)
            .flatMap { existingContactPerson ->
                if (existingContactPerson?.company?.id != companyId) {
                    Uni.createFrom().failure<EntityNotFoundException>(EntityNotFoundException("Contact person not found"))
                } else {
                    updatedContactPerson.id = existingContactPerson.id
                    updatedContactPerson.company = existingContactPerson.company
                    contactPersonRepository.update(updatedContactPerson)
                }
            }
            .map { mergedContactPerson ->
                Response.ok(mergedContactPerson).build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is ConstraintViolationException -> {
                        val errors = throwable.constraintViolations.map { it.message }
                        Response.status(Response.Status.BAD_REQUEST)
                            .entity(errors)
                            .build()
                    }
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    is WebApplicationException -> { // For custom responses
                        throwable.response
                    }
                    else -> {
                        Response.serverError()
                            .entity("Error updating contact person: ${throwable.message}")
                            .build()
                    }
                }
            }
    }

    /**
     * DELETE /contact-person/{id}
     * Deletes a contact person.
     */
    @DELETE
    @Path("/contact-person/{id}")
    fun deleteContactPerson(@PathParam("id") contactPersonId: String): Uni<Response> {
        return contactPersonRepository.deleteById(contactPersonId)
            .map {
                Response.noContent().build()
            }
            .onFailure().recoverWithItem { throwable ->
                when (throwable) {
                    is EntityNotFoundException -> {
                        Response.status(Response.Status.NOT_FOUND)
                            .entity(throwable.message)
                            .build()
                    }
                    else -> {
                        val rootCause = getRootCause(throwable)
                        if (rootCause is IllegalStateException &&
                            rootCause.message?.contains("referenced by one or more invoices") == true
                        ) {
                            Response.status(Response.Status.CONFLICT)
                                .entity("Kontaktperson kann nicht gelöscht werden, da sie in einer Rechnung verwendet wird.")
                                .build()
                        } else {
                            Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                .entity("Error deleting ContactPerson: ${throwable.message}")
                                .build()
                        }
                    }
                }
            }
    }


    /**
     * GET /company/search
     * Sucht Unternehmen anhand eines Query-Strings (z. B. Name oder Branche).
     */
    @GET
    @Path("/search")
    fun searchCompanies(@QueryParam("query") query: String?): Uni<Response> {
        val safeQuery = query?.trim() ?: ""
        return companyRepository.searchCompanies(safeQuery)
            .map { companies ->
                Response.ok(companies).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error searching companies: ${throwable.message}")
                    .build()
            }
    }
}