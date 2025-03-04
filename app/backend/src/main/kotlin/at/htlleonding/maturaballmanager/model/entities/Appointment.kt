package at.htlleonding.maturaballmanager.model.entities

import at.htlleonding.maturaballmanager.model.dtos.AppointmentResponse
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalTime

@Entity
@Table(name = "appointments")
data class Appointment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var date: LocalDate,

    var startTime: LocalTime? = null,

    var endTime: LocalTime? = null,

    @ManyToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
    var creator: TeamMember,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "appointment_team_members",
        joinColumns = [JoinColumn(name = "appointment_id")],
        inverseJoinColumns = [JoinColumn(name = "team_member_id")]
    )
    var members: MutableList<TeamMember> = mutableListOf()
) : PanacheEntityBase() {
    constructor() : this(
        name = "",
        date = LocalDate.now(),
        startTime = null,
        creator = TeamMember()
    )
}
