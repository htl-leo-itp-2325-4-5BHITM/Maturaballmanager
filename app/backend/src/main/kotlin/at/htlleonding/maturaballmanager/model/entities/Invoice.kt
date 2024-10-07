// src/main/kotlin/at/htlleonding/maturaballmanager/model/entities/Invoice.kt

package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.Status
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.json.bind.annotation.JsonbDateFormat
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "invoices")
class Invoice : PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null

    @Column(name = "invoice_number", unique = true, nullable = false)
    var invoiceNumber: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    @NotNull(message = "Firma ist erforderlich")
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
}
