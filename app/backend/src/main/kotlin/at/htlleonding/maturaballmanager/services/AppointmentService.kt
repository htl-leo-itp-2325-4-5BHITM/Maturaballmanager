package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.model.entities.Appointment
import at.htlleonding.maturaballmanager.repositories.AppointmentRepository
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.time.LocalDate

@ApplicationScoped
class AppointmentService {

    @Inject
    lateinit var appointmentRepository: AppointmentRepository

    fun getAppointments(keycloakId: String): Uni<List<Appointment>> {
        return appointmentRepository.listAll().onItem().transform { appointments ->
            appointments.filter { appointment ->
                appointment.members.isEmpty() ||
                        appointment.members.any { it.keycloakId == keycloakId } ||
                        appointment.creator.keycloakId == keycloakId
            }
        }
    }

    fun createAppointment(appointment: Appointment): Uni<Appointment> {
        return appointmentRepository.persist(appointment)
    }

    fun findById(id: Long): Uni<Appointment?> {
        return appointmentRepository.findById(id)
    }

    fun updateAppointment(existing: Appointment, updated: Appointment): Uni<Appointment> {
        existing.name = updated.name
        existing.date = updated.date
        existing.startTime = updated.startTime
        existing.endTime = updated.endTime
        existing.members = updated.members
        return appointmentRepository.persist(existing)
    }

    fun deleteAppointment(appointment: Appointment): Uni<Void> {
        return appointmentRepository.delete(appointment)
    }

    fun getAppointmentsForDate(keycloakId: String, date: LocalDate, roles: List<String>): Uni<List<Appointment>> {
        return appointmentRepository.list("date", date).onItem().transform { appointments ->
            if (roles.contains("supervisor") || roles.contains("management")) {
                appointments
            } else {
                appointments.filter { appointment ->
                    appointment.members.isEmpty() ||
                            appointment.members.any { it.keycloakId == keycloakId } ||
                            appointment.creator.keycloakId == keycloakId
                }
            }
        }
    }
}