package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.Address
import jakarta.persistence.*
import jakarta.validation.constraints.*

@Entity
@Table(name = "companies")
class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @NotBlank(message = "Name ist erforderlich")
    @Size(max = 100, message = "Name darf maximal 100 Zeichen lang sein")
    var name: String? = null

    @NotBlank(message = "Branche ist erforderlich")
    @Size(max = 100, message = "Branche darf maximal 100 Zeichen lang sein")
    var industry: String? = null

    @Pattern(
        regexp = "^$|(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?",
        message = "Bitte eine gültige URL eingeben"
    )
    var website: String? = null

    @Email(message = "Bitte eine gültige E-Mail-Adresse eingeben")
    @Column(name = "office_email")
    var officeEmail: String? = null

    @Pattern(
        regexp = "^$|^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$",
        message = "Bitte eine gültige Telefonnummer eingeben"
    )
    @Column(name = "office_phone")
    var officePhone: String? = null

    @Embedded
    var address: Address? = null

    @OneToMany(mappedBy = "company", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, targetEntity = ContactPerson::class)
    var contactPersons: List<ContactPerson> = mutableListOf()
}
