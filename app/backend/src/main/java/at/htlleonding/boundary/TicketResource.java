package at.htlleonding.boundary;

import at.htlleonding.model.dto.tickets.TicketQRCodeDTO;
import at.htlleonding.services.TicketQRService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/tickets")
public class TicketResource {

    @Inject
    TicketQRService qrService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces("image/png")
    @Path("/qr")
    public Response generateQRCode(String info) {
        try {
            byte[] qrCode = qrService.generateSignedQRCode(info);
            return Response.ok(qrCode).build();
        } catch (Exception e) {
            return Response.serverError().entity("Error generating QR code").build();
        }
    }
}
