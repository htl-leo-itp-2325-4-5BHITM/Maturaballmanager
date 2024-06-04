package at.htlleonding.maturaballmanager;

import at.htlleonding.maturaballmanager.contracts.repo.ITicketRepository;
import at.htlleonding.maturaballmanager.entity.Ticket;
import at.htlleonding.maturaballmanager.model.TicketDTO;
import at.htlleonding.maturaballmanager.repository.TicketRepository;
import at.htlleonding.maturaballmanager.services.TicketService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.logging.Level;
import java.util.logging.Logger;

@Path("/tickets")
public class TicketResource {
    private static final Logger LOGGER = Logger.getLogger(TicketResource.class.getName());

    @Inject
    TicketService ticketService;

    @Inject
    ITicketRepository ticketRepository;

    @POST
    @Path("/create-qr")
    public Response createTicketQRCode(Long id) {
        try {
            byte[] qrCode = ticketService.createTicketQRCode(id);
            return Response.ok().entity(qrCode).type("image/png").build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error creating QR code: {0}", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error creating QR code").build();
        }
    }

    @GET
    @Path("/status/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkRedeemedStatus(@PathParam("id") Long id) {
        Ticket ticket = ticketRepository.findById(id);
        if (ticket == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(ticket.isRedeemed()).build();
    }

    @Transactional
    @GET
    @Path("/redeem/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response redeemTicket(@PathParam("id") Long id) {
        try {
            ticketService.redeem(id);
            return Response.ok().build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error redeeming ticket: {0}", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error redeeming ticket").build();
        }
    }
}
