package at.htlleonding.entities;

import at.htlleonding.entities.item.BookedItem;
import at.htlleonding.model.enums.InvoiceStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Set;

@Entity
@SequenceGenerator(name = "invoiceSeq", initialValue = 50, allocationSize = 1)
public class Invoice {
    private static final long INVOICE_TIMEOUT = 14;

    @Id
    @GeneratedValue(generator = "invoiceSeq")
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    private Company company;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private Set<BookedItem> items;

    @CreationTimestamp
    private LocalDate bookingDate;

    @NotNull
    private LocalDate dueDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    public Invoice() {

    }

    public Invoice(Company company) {
        this();
        this.setDueDate();
        this.setCompany(company);
    }

    public Invoice(Company company, Set<BookedItem> items) {
        this(company);
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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Invoice setDueDate() {
        this.dueDate = bookingDate.plusDays(INVOICE_TIMEOUT);
        switch(this.dueDate.getDayOfWeek()) {
            case SATURDAY -> this.dueDate = this.dueDate.plusDays(2);
            case SUNDAY -> this.dueDate = this.dueDate.plusDays(1);
        }
        return this;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    public Invoice setStatus(InvoiceStatus status) {
        this.status = status;
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
