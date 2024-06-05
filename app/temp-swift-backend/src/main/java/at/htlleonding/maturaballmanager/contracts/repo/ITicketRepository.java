package at.htlleonding.maturaballmanager.contracts.repo;

import at.htlleonding.maturaballmanager.entity.Ticket;

import java.util.List;

public interface ITicketRepository {
    List<Ticket> findAll();
    Ticket findById(Long id);
    Ticket save(Ticket ticket);
    Ticket update(Ticket ticket);
    void delete(Long id);
    boolean redeem(Long id);
}