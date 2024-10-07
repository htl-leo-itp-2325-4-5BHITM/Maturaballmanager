package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.model.entities.Invoice
import at.htlleonding.maturaballmanager.services.InvoiceService
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import jakarta.validation.Valid
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.jwt.JsonWebToken
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
    fun getAllInvoices(): List<Invoice> {
        return invoiceService.findAllInvoices()
    }

    /**
     * Creates a new invoice.
     */
    @POST
    @Transactional
    fun createInvoice(@Valid invoice: Invoice): Invoice {
        return invoiceService.createInvoice(invoice)
    }

    /**
     * Retrieves a specific invoice by ID.
     */
    @GET
    @Path("/{id}")
    fun getInvoice(@PathParam("id") id: UUID): Invoice {
        return invoiceService.findInvoice(id)
    }

    /**
     * Updates an existing invoice.
     */
    @PUT
    @Path("/{id}")
    @Transactional
    fun updateInvoice(@PathParam("id") id: UUID, @Valid invoice: Invoice): Invoice {
        return invoiceService.updateInvoice(id, invoice)
    }

    /**
     * Deletes an invoice by ID.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    fun deleteInvoice(@PathParam("id") id: UUID): Response {
        val deleted = invoiceService.deleteInvoice(id)
        return if (deleted) {
            Response.noContent().build()
        } else {
            throw NotFoundException("Invoice not found")
        }
    }

    /**
     * Sends an invoice via email.
     */
    @POST
    @Path("/{id}/send")
    @Transactional
    fun sendInvoice(@PathParam("id") id: UUID): Response {
        invoiceService.sendInvoiceByEmail(id)
        return Response.ok().build()
    }

    /**
     * Downloads the PDF of an invoice.
     */
    @GET
    @Path("/{id}/pdf")
    @Produces("application/pdf")
    fun getInvoicePdf(@PathParam("id") id: UUID): Response {
        val invoice = invoiceService.findInvoice(id)
        val pdfBytes = invoiceService.generateInvoicePdf(invoice)
        return Response.ok(pdfBytes)
            .header("Content-Disposition", "attachment; filename=\"Invoice_$id.pdf\"")
            .build()
    }
}