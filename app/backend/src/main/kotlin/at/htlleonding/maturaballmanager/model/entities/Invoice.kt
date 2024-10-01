package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.Status
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.LocalDate

@Entity
@Table(name = "invoices")
class Invoice : PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    @NotNull(message = "Company is required")
    var company: Company? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_person_id")
    var contactPerson: ContactPerson? = null

    @ManyToMany
    @JoinTable(
        name = "invoice_benefits",
        joinColumns = [JoinColumn(name = "invoice_id")],
        inverseJoinColumns = [JoinColumn(name = "benefit_id")]
    )
    @NotNull(message = "At least one benefit is required")
    var benefits: MutableList<Benefit> = mutableListOf()

    var invoiceDate: LocalDate? = null

    var paymentDeadline: LocalDate? = null

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    var status: Status = Status.DRAFT

    var totalAmount: Double? = 0.0
}