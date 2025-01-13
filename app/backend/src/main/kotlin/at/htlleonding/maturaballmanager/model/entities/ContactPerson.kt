package at.htlleonding.maturaballmanager.model.entities

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase
import jakarta.json.bind.annotation.JsonbTransient
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

@Entity
@Table(name = "contact_persons")
class ContactPerson: PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @Column(name = "prefix_title")
    var prefixTitle: String? = null

    @NotBlank(message = "Vorname ist erforderlich")
    @Column(name = "first_name")
    var firstName: String? = null

    @NotBlank(message = "Nachname ist erforderlich")
    @Column(name = "last_name")
    var lastName: String? = null

    @Column(name = "suffix_title")
    var suffixTitle: String? = null

    @NotNull(message = "Geschlecht ist erforderlich")
    @Pattern(regexp = "M|W|D", message = "Geschlecht muss 'M', 'W' oder 'D' sein")
    var gender: String? = null

    @NotBlank(message = "Position ist erforderlich")
    var position: String? = null

    @Email(message = "Bitte eine gültige E-Mail-Adresse eingeben")
    @Column(name = "personal_email")
    var personalEmail: String? = null

    @Pattern(
        regexp = "^$|^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$",
        message = "Bitte eine gültige Telefonnummer eingeben"
    )
    @Column(name = "personal_phone")
    var personalPhone: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    @JsonbTransient
    var company: Company? = null
}