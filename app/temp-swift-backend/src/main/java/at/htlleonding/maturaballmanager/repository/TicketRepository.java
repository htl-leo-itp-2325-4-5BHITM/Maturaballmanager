package at.htlleonding.maturaballmanager.repository;

import at.htlleonding.maturaballmanager.contracts.repo.ITicketRepository;
import at.htlleonding.maturaballmanager.entity.Ticket;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
@Transactional
public class TicketRepository implements ITicketRepository {

    @Inject
    EntityManager em;

    @Override
    public List<Ticket> findAll() {
        return em.createQuery("SELECT t FROM Ticket t", Ticket.class).getResultList();
    }

    @Override
    public Ticket findById(Long id) {
        return em.find(Ticket.class, id);
    }

    @Override
    public Ticket save(Ticket ticket) {
        em.persist(ticket);
        return ticket;
    }

    @Override
    public Ticket update(Ticket ticket) {
        return em.merge(ticket);
    }

    @Override
    public void delete(Long id) {
        Ticket ticket = findById(id);
        if (ticket != null) {
            em.remove(ticket);
        }
    }

    public boolean redeem(Long id) {
        Ticket ticket = findById(id);
        if (ticket != null) {
            ticket.setRedeemed(true);
            update(ticket);
            return true;
        }
        return false;
    }
}