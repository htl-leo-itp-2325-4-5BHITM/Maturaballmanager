package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.Status
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.OffsetDateTime

@Entity
@Table(name = "invoices")
class Invoice : PanacheEntityBase() {

    @Id
    @Column(length = 8)
    var id: String? = null

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    @NotNull(message = "Firma ist erforderlich")
    var company: Company? = null

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_person_id")
    var contactPerson: ContactPerson? = null

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "invoice_benefits",
        joinColumns = [JoinColumn(name = "invoice_id")],
        inverseJoinColumns = [JoinColumn(name = "benefit_id")]
    )
    @NotNull(message = "Mindestens eine Leistung ist erforderlich")
    var benefits: MutableList<Benefit> = mutableListOf()

    @NotNull(message = "Rechnungsdatum ist erforderlich")
    var invoiceDate: OffsetDateTime? = null

    var paymentDeadline: OffsetDateTime? = null

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status ist erforderlich")
    var status: Status = Status.DRAFT

    @NotNull(message = "Gesamtbetrag ist erforderlich")
    var totalAmount: Double? = 0.0

    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "prom_id")
    var prom: Prom? = null

    @Column(name = "send_option")
    var sendOption: String? = "immediate"
}