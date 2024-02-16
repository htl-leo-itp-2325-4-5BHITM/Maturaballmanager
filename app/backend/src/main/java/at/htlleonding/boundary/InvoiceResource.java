package at.htlleonding.boundary;

import at.htlleonding.model.dto.invoice.CreateInvoiceDTO;
import at.htlleonding.repo.InvoiceRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/invoices")
public class InvoiceResource {

    @Inject
    InvoiceRepository invoiceRepository;

    @GET
    @Path("/getByCompany/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getInvoicesByCompany(@PathParam("id") long id) {
        try {
            return Response.ok(invoiceRepository.getByCompany(id)).build();
        } catch (Exception e) {
            return Response.serverError().build();
        }
    }

    @POST
    @Transactional
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addInvoice(CreateInvoiceDTO dto) {
        invoiceRepository.add(dto);
        return Response.ok().build();
    }

    @DELETE
    @Transactional
    @Path("/delete/{id}")
    public Response deleteInvoice(@PathParam("id") long id) {
        invoiceRepository.delete(id);
        return Response.ok().build();
    }
}
