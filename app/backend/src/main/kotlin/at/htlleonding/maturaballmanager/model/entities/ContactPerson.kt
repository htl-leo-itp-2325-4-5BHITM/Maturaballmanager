package at.htlleonding.maturaballmanager.model.entities

import jakarta.json.bind.annotation.JsonbTransient
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Entity
@Table(name = "contact_persons")
class ContactPerson : PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @Column(name = "prefix_title")
    var prefix_title: String? = null

    @NotBlank(message = "Vorname ist erforderlich")
    @Column(name = "first_name")
    var first_name: String? = null

    @NotBlank(message = "Nachname ist erforderlich")
    @Column(name = "last_name")
    var last_name: String? = null

    @Column(name = "suffix_title")
    var suffix_title: String? = null

    @NotNull(message = "Geschlecht ist erforderlich")
    var gender: String? = null // M, W, D

    @NotBlank(message = "Position ist erforderlich")
    var position: String? = null

    @Email(message = "Bitte eine gültige E-Mail-Adresse eingeben")
    @Column(name = "personal_email")
    var personal_email: String? = null

    @Column(name = "personal_phone")
    var personal_phone: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    @JsonbTransient // Verhindert die Serialisierung der 'company_id'-Eigenschaft
    var company_id: Company? = null
}
