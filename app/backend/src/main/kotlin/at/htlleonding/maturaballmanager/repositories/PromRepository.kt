package at.htlleonding.maturaballmanager.repositories

import at.htlleonding.maturaballmanager.model.Address
import at.htlleonding.maturaballmanager.model.dtos.PromDTO
import at.htlleonding.maturaballmanager.model.entities.DayPlan
import at.htlleonding.maturaballmanager.model.entities.Prom
import at.htlleonding.maturaballmanager.services.TeamMemberService
import io.quarkus.hibernate.reactive.panache.PanacheRepository
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.NotFoundException
import java.time.LocalDate
import java.time.LocalTime

@ApplicationScoped
class PromRepository : PanacheRepository<Prom> {

    @Inject
    lateinit var teamMemberService: TeamMemberService

    fun findLastActiveProm(): Uni<Prom> {
        return find("active = true order by createdAt desc").firstResult()
    }

    @WithTransaction
    fun createProm(dto: PromDTO): Uni<Prom> {
        return findLastActiveProm().flatMap { activeProm ->
            if (activeProm != null) {
                Uni.createFrom().failure(IllegalStateException("Es existiert bereits ein aktiver Maturaball."))
            } else {
                val address = Address(
                    street = dto.street,
                    houseNumber = dto.houseNumber,
                    postalCode = dto.zip,
                    city = dto.city,
                    country = "AT"
                )

                val prom = Prom().apply {
                    name = dto.motto
                    this.address = address
                    date = LocalDate.parse(dto.date)
                    time = LocalTime.parse(dto.time)
                    active = true

                    dto.dayPlan?.forEach { dp ->
                        val entry = DayPlan().apply {
                            this.name = dp.name
                            this.time = LocalTime.parse(dp.time)
                        }
                        dayPlan.add(entry)
                    }
                }
                persist(prom)
            }
        }
    }

    @WithTransaction
    fun updateProm(id: String, dto: PromDTO): Uni<Prom> {
        return find("id", id).firstResult<Prom>()
            .onItem().ifNull().failWith(IllegalArgumentException("Maturaball nicht gefunden"))
            .flatMap { existingProm ->
                if (!existingProm.active) {
                    return@flatMap Uni.createFrom().failure<Prom>(IllegalStateException("Maturaball ist nicht aktiv."))
                }
                val address = existingProm.address ?: Address()
                address.street = dto.street
                address.houseNumber = dto.houseNumber
                address.postalCode = dto.zip
                address.city = dto.city

                existingProm.apply {
                    name = dto.motto
                    this.address = address
                    date = LocalDate.parse(dto.date)
                    time = LocalTime.parse(dto.time)
                    dayPlan.clear()
                    dto.dayPlan?.forEach { dp ->
                        val entry = DayPlan().apply {
                            this.name = dp.name
                            this.time = LocalTime.parse(dp.time)
                        }
                        dayPlan.add(entry)
                    }
                }
                persist(existingProm)
            }
    }

    @WithTransaction
    fun deactivateProm(id: String): Uni<Void> {
        return find("id", id).firstResult<Prom>().flatMap { prom ->
            if (prom != null) {
                teamMemberService.removeAllRolesExceptSupervisor()
                    .flatMap {
                        delete(prom)
                    }
            } else {
                Uni.createFrom().failure<Void>(NotFoundException("Prom with id $id not found"))
            }
        }
    }

}