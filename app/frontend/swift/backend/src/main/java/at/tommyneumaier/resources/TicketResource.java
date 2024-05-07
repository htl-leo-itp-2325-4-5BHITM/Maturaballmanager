package at.tommyneumaier.resources;

import at.tommyneumaier.repository.TicketRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("api/ticket")
public class TicketResource {

    @Inject
    TicketRepository ticketRepository;

    @POST
    @Path("qr-code")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces("image/png")
    public Response qr(long id) {
        return Response.ok(ticketRepository.getTicketQrCode(id)).build();
    }
}
