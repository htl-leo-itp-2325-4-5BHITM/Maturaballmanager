package at.htlleonding.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Set;

@Entity
public class Bill {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Company company;

    @OneToMany(mappedBy = "bill")
    private Set<BookedItem> items;

    @CreationTimestamp
    private LocalDate bookingDate;

    public Bill() {

    }

    public Bill(Company company) {
        this();
        this.setCompany(company);
    }

    //<editor-fold desc="Getter & Setter">
    public Long getId() {
        return id;
    }

    public Bill setId(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public Bill setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
        return this;
    }

    public Company getCompany() {
        return company;
    }

    public Bill setCompany(Company company) {
        this.company = company;
        return this;
    }

    public Set<BookedItem> getItems() {
        return items;
    }

    public Bill setItems(Set<BookedItem> items) {
        this.items = items;
        return this;
    }
    //</editor-fold>
}
