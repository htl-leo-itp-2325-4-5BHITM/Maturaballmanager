package at.htlleonding.maturaballmanager.resources

import InvoiceDTO
import SendInvoiceRequest
import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.services.InvoiceService
import jakarta.inject.Inject
import jakarta.validation.Valid
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.jwt.JsonWebToken
import io.smallrye.mutiny.Uni
import java.util.UUID

@Path("/invoices")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class InvoiceResource {

    @Inject
    lateinit var invoiceService: InvoiceService

    @Inject
    lateinit var jwt: JsonWebToken

    /**
     * Retrieves all invoices.
     */
    @GET
    fun getAllInvoices(): Uni<List<InvoiceDTO>> {
        return invoiceService.findAllInvoices()
    }

    /**
     * Creates a new invoice.
     */
    @POST
    fun createInvoice(@Valid invoiceDTO: InvoiceDTO): Uni<Response> {
        return invoiceService.createInvoice(invoiceDTO)
            .map { createdInvoiceDTO: InvoiceDTO ->
                Response.status(Response.Status.CREATED).entity(createdInvoiceDTO).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to create invoice: ${throwable}")
                    .build()
            }
    }

    /**
     * Retrieves a specific invoice by ID.
     */
    @GET
    @Path("/{id}")
    fun getInvoice(@PathParam("id") id: String): Uni<Response> {
        return invoiceService.findInvoice(id)
            .map { it.toDTO() }
            .map { invoiceDTO -> Response.ok(invoiceDTO).build() }
    }

    /**
     * Updates an existing invoice.
     */
    @PUT
    @Path("/{id}")
    fun updateInvoice(@PathParam("id") id: String, @Valid invoiceDTO: InvoiceDTO): Uni<Response> {
        return invoiceService.updateInvoice(id, invoiceDTO)
            .map { updatedInvoiceDTO: InvoiceDTO ->
                Response.ok(updatedInvoiceDTO).build()
            }
    }

    /**
     * Deletes an invoice by ID.
     */
    @DELETE
    @Path("/{id}")
    fun deleteInvoice(@PathParam("id") id: String): Uni<Response> {
        return invoiceService.deleteInvoice(id)
            .map { deleted ->
                if (deleted) {
                    Response.noContent().build()
                } else {
                    Response.status(Response.Status.NOT_FOUND)
                        .entity("Invoice not found")
                        .build()
                }
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to delete invoice: ${throwable.message}")
                    .build()
            }
    }

    /**
     * Sends an invoice via email.
     */
    @POST
    @Path("/{id}/send")
    fun sendInvoice(
        @PathParam("id") id: String,
        @Valid sendInvoiceRequest: SendInvoiceRequest
    ): Uni<Response> {
        return invoiceService.sendInvoice(id, sendInvoiceRequest.target)
            .map {
                Response.ok().build()
            }
            .onFailure().recoverWithItem { throwable ->
                val rootCause = getRootCause(throwable)
                val message = rootCause.message ?: rootCause.javaClass.simpleName

                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to send invoice: $message")
                    .build()
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
     * Downloads the PDF of an invoice.
     */
    @GET
    @Path("/{id}/pdf")
    @Produces("application/pdf")
    fun getInvoicePdf(@PathParam("id") id: String): Uni<Response> {
        val senderName = jwt.getClaim<String>("name").toString()
        return invoiceService.generateInvoicePdf(id, senderName, isCopy = true)
            .map { pdfBytes ->
                Response.ok(pdfBytes)
                    .header("Content-Disposition", "attachment; filename=\"Rechnung_${id}.pdf\"")
                    .build()
            }
    }


    /**
     * Prüft, ob eine Rechnung für den Versand geeignet ist.
     */
    @GET
    @Path("/{id}/send/check")
    fun checkIfInvoiceIsSendable(@PathParam("id") id: String): Uni<Response> {
        return invoiceService.checkIfInvoiceIsSendable(id)
            .map { checkResult ->
                if (checkResult.isValid) {
                    Response.ok(checkResult).build()
                } else {
                    Response.status(Response.Status.BAD_REQUEST).entity(checkResult).build()
                }
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Fehler bei der Validierung der Rechnung: ${throwable.message}")
                    .build()
            }
    }

    @POST
    @Path("/{id}/pay")
    fun markInvoiceAsPaid(@PathParam("id") id: String): Uni<Response> {
        return invoiceService.markInvoiceAsPaid(id)
            .map { updatedInvoice ->
                Response.ok(updatedInvoice).build()
            }
            .onFailure().recoverWithItem { throwable ->
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to mark invoice as paid: ${throwable.message}")
                    .build()
            }
    }
}