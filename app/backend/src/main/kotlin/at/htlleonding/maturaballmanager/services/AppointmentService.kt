package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.dtos.AppointmentRequest
import at.htlleonding.maturaballmanager.model.dtos.AppointmentResponse
import at.htlleonding.maturaballmanager.model.entities.Appointment
import at.htlleonding.maturaballmanager.model.entities.TeamMember
import at.htlleonding.maturaballmanager.repositories.AppointmentRepository
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.smallrye.mutiny.Multi
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

@ApplicationScoped
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val teamMemberService: TeamMemberService // Reaktiver Service für TeamMember
) {

    fun getAllAppointments(): Uni<List<AppointmentResponse>> {
        return appointmentRepository.listAll().onItem().transform { appointments ->
            appointments.map { it.toResponse() }
        }
    }

    @WithTransaction
    fun getAppointmentsByDate(date: String): Uni<List<AppointmentResponse>> {
        val localDate = java.time.LocalDate.parse(date)
        return appointmentRepository.list("date", localDate).onItem().transform { appointments ->
            appointments.map { it.toResponse() }
        }
    }

    @WithTransaction
    fun createAppointment(request: AppointmentRequest): Uni<AppointmentResponse> {
        return teamMemberService.findById( request.creatorId)
            .onItem().transformToUni { creator: TeamMember ->
                val appointment = Appointment(
                    name = request.name,
                    date = request.date,
                    startTime = request.startTime,
                    endTime = request.endTime,
                    creator = creator
                )

                (
                        if (request.memberIds.isNotEmpty())
                            Multi.createFrom().iterable(request.memberIds)
                                .onItem().transformToUni { teamMemberService.findById(it) }
                                .concatenate()
                                .collect().asList()
                        else
                            Uni.createFrom().item(emptyList<TeamMember>())
                        )
                    .onItem().transformToUni { members: List<TeamMember> ->
                        appointment.members.addAll(members)
                        appointmentRepository.persist(appointment)
                            .onItem().transform { appointment.toResponse() }
                    }
            }
    }

    @WithTransaction
    fun updateAppointment(id: Long, request: AppointmentRequest): Uni<AppointmentResponse> {
        return appointmentRepository.findById(id)
            .onItem().ifNotNull().transformToUni { appointment ->
                appointment.name = request.name
                appointment.date = request.date
                appointment.startTime = request.startTime
                appointment.endTime = request.endTime
                teamMemberService.findById(request.creatorId)
                    .onItem().transformToUni { creator: TeamMember ->
                        appointment.creator = creator
                        Multi.createFrom().iterable(request.memberIds)
                            .onItem().transformToUni { memberId -> teamMemberService.findById(memberId) }
                            .concatenate()
                            .collect().asList()
                            .onItem().transformToUni { members: List<TeamMember> ->
                                appointment.members.clear()
                                appointment.members.addAll(members)
                                appointmentRepository.persist(appointment)
                                    .onItem().transform { appointment.toResponse() }
                            }
                    }
            }
    }

    @WithTransaction
    fun deleteAppointment(id: Long): Uni<Void> {
        return appointmentRepository.deleteById(id)
            .onItem().transform { null }
    }

    private fun Appointment.toResponse(): AppointmentResponse {
        return AppointmentResponse(
            id = this.id,
            name = this.name,
            date = this.date,
            startTime = this.startTime,
            endTime = this.endTime,
            creator = this.creator.toSmallDTO(),
            members = this.members.map { it.toSmallDTO() }
        )
    }
}