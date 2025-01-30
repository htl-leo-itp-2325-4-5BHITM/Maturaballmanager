package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.Address
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase.find
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.UUID

@Entity
@Table(name = "proms")
class Prom: PanacheEntityBase() {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null

    @Column(nullable = false, unique = true)
    var name: String? = null

    @Column(nullable = false)
    var address: Address? = null

    @Column(nullable = false)
    var date: LocalDate? = null

    @Column(nullable = false)
    var time: LocalTime? = null

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "prom_tagesablauf",
        joinColumns = [JoinColumn(name = "prom_id")]
    )
    @OrderBy("time ASC")
    var dayPlan: MutableList<DayPlan> = mutableListOf()

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    var createdAt: LocalDateTime? = null

    @Column(name ="active", nullable = false)
    var active: Boolean = true
}

@Embeddable
class DayPlan {
    @Column(name = "time", nullable = false)
    var time: LocalTime? = null

    @Column(name = "name", nullable = false)
    var name: String? = null
}