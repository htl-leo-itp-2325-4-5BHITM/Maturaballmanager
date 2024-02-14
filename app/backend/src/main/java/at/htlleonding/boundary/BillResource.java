package at.htlleonding.boundary;

import at.htlleonding.model.dto.BillDTO;
import at.htlleonding.repo.BillManager;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/bills")
public class BillResource {

    @Inject
    BillManager bm;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response hello() {
        return Response.ok().build();
    }

    @POST
    @Path("/getBill")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBill(Long id) {
        try {
            return Response.ok(bm.getBill(id)).status(200).build();
        } catch (IllegalArgumentException exception) {
            return Response.ok("Bill not found").status(500).build();
        }
    }

    @POST
    @Path("/addBill")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addBill(BillDTO dto) {
        try {
           bm.addBill(dto);
           return Response.ok().build();
        } catch (IllegalArgumentException exception) {
            return Response.ok().status(500).build();
        }
    }

    @POST
    @Path("/deleteBill")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteBill(Long id) {
        try {
            bm.deleteBill(id);
            return Response.ok().build();
        } catch (IllegalArgumentException exception) {
            return Response.ok("Bill not found").status(500).build();
        }
    }
}
