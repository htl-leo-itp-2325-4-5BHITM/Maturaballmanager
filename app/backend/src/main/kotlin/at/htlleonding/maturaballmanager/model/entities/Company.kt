package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.Address
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "companies")
class Company : PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @NotBlank(message = "Name ist erforderlich")
    var name: String? = null

    @NotBlank(message = "Branche ist erforderlich")
    var industry: String? = null

    var website: String? = null

    @Email(message = "Bitte eine gültige E-Mail-Adresse eingeben")
    @Column(name = "office_email")
    var office_email: String? = null

    @Column(name = "office_phone")
    var office_phone: String? = null

    @Embedded
    var address: Address? = null

    @OneToMany(mappedBy = "company_id", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, targetEntity = ContactPerson::class)
    var contact_persons: List<ContactPerson> = mutableListOf()
}
