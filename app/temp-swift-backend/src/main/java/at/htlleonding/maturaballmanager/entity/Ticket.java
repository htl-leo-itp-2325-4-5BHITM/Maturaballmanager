package at.htlleonding.maturaballmanager.entity;

import io.smallrye.common.constraint.NotNull;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import java.time.LocalDate;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private boolean qrCreated;

    @NotNull
    private boolean redeemed;

    @NotNull
    private LocalDate createdAt;

    @OneToOne
    private User user;

    public Ticket() {
        this.qrCreated = false;
        this.redeemed = false;
        this.createdAt = LocalDate.now();
    }

    // Getter und Setter für alle Felder
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isQrCreated() {
        return qrCreated;
    }

    public Ticket setQrCreated(boolean qrCreated) {
        this.qrCreated = qrCreated;
        return this;
    }

    public boolean isRedeemed() {
        return redeemed;
    }

    public void setRedeemed(boolean redeemed) {
        this.redeemed = redeemed;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}