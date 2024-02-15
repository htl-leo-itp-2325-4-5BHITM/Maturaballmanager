package at.htlleonding.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Set;

@Entity
public class Invoice {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    private Company company;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private Set<BookedItem> items;

    @CreationTimestamp
    private LocalDate bookingDate;

    public Invoice() {

    }

    public Invoice(Company company) {
        this();
        this.setCompany(company);
    }

    //<editor-fold desc="Getter & Setter">
    public Long getId() {
        return id;
    }

    public Invoice setId(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public Invoice setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
        return this;
    }

    public Company getCompany() {
        return company;
    }

    public Invoice setCompany(Company company) {
        this.company = company;
        return this;
    }

    public Set<BookedItem> getItems() {
        return items;
    }

    public Invoice setItems(Set<BookedItem> items) {
        this.items = items;
        return this;
    }
    //</editor-fold>
}
