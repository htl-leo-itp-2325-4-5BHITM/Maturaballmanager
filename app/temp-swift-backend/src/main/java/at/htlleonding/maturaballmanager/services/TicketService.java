package at.htlleonding.maturaballmanager.services;

import at.htlleonding.maturaballmanager.entity.Ticket;
import at.htlleonding.maturaballmanager.entity.User;
import at.htlleonding.maturaballmanager.model.TicketDTO;
import at.htlleonding.maturaballmanager.model.UserDTO;
import at.htlleonding.maturaballmanager.repository.TicketRepository;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.logging.Level;
import java.util.logging.Logger;

@ApplicationScoped
public class TicketService {
    private static final Logger LOGGER = Logger.getLogger(TicketService.class.getName());

    @Inject
    TicketRepository ticketRepository;

    @Inject
    QrService qrService;

    public byte[] createTicketQRCode(Long id) throws Exception {
        try {
            Ticket ticket = ticketRepository.findById(id);
            if (ticket == null) {
                LOGGER.severe("Ticket not found");
                throw new RuntimeException("Ticket not found");
            }

            User user = ticket.getUser();
            if (user == null) {
                LOGGER.severe("User not found");
                throw new RuntimeException("User not found");
            }

            UserDTO userDTO = new UserDTO(user.getFirstName(), user.getLastName(), user.getSex(), user.isVipStatus());

            String digitalSignature = qrService.signData("Issuer: HTL Leonding");
            if (digitalSignature == null) {
                LOGGER.severe("Failed to sign data");
                throw new RuntimeException("Failed to sign data");
            }
            TicketDTO ticketDTO = new TicketDTO(ticket.getId(), ticket.isRedeemed(), userDTO, digitalSignature);


            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(ticketDTO);

            return qrService.createQRCode(jsonData);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error creating ticket QR code: {0}", e.getMessage());
            throw e;
        }
    }

    public void redeem(Long id) {
        try {
            ticketRepository.redeem(id);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error redeeming ticket: {0}", e.getMessage());
            throw e;
        }
    }
}
