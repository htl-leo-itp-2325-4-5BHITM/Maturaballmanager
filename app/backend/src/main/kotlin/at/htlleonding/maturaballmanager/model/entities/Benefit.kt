package at.htlleonding.maturaballmanager.model.entities

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import java.util.UUID

@Entity
@Table(name = "benefits")
class Benefit : PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @NotBlank(message = "Name der Leistung ist erforderlich")
    var name: String? = null

    var description: String? = null

    @PositiveOrZero(message = "Preis muss positiv oder null sein")
    var price: Double = 0.0

    @ManyToOne
    @JoinColumn(name = "prom_id")
    var prom: Prom? = null
}
