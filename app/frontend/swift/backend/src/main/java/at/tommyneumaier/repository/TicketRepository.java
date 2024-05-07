package at.tommyneumaier.repository;

import at.tommyneumaier.model.Customer;
import at.tommyneumaier.model.dto.CustomerInformationDTO;
import at.tommyneumaier.model.dto.TicketInformationDTO;
import at.tommyneumaier.services.QrService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class TicketRepository {

    @Inject
    EntityManager em;

    @Inject
    QrService qrService;

    public byte[] getTicketQrCode(long ticketId) {
        try {
            return qrService.createSignedQRCode(getTicketInformation(ticketId));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private TicketInformationDTO getTicketInformation(long ticketId) {
        CustomerInformationDTO customerInformationDTO
                = em.createQuery("SELECT new at.tommyneumaier.model.dto.CustomerInformationDTO(c.sex, concat(c.firstName,' ', c.lastName), c.birthDate) FROM Customer c WHERE :ticketId = c.id", CustomerInformationDTO.class).setParameter("ticketId", ticketId).getSingleResult();
        return new TicketInformationDTO(ticketId, customerInformationDTO);
    }
}
