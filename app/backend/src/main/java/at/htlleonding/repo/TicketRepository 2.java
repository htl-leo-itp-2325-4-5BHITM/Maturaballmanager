package at.htlleonding.repo;

import at.htlleonding.model.dto.customer.CustomerDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

@ApplicationScoped
public class TicketRepository {

    @Inject
    EntityManager em;

    public CustomerDTO getCustomerByID(String tid) {
        try {
            Long id = Long.parseLong(tid);
            return em.createQuery("SELECT new at.htlleonding.model.dto.customer.CustomerDTO(c.isVip, c.sex, c.firstName, c.lastName) FROM Ticket t LEFT JOIN Customer c ON t.customer = c WHERE t.id = :id", CustomerDTO.class).setParameter("id", id).getSingleResult();
        } catch (NoResultException e) {
            throw new IllegalArgumentException("Ticket not found!");
        }
    }
}
