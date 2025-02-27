package at.htlleonding.maturaballmanager.model.dtos

import java.time.LocalDate
import java.time.LocalTime

data class AppointmentDTO(
    val id: Long = -1,
    val name: String,
    val date: LocalDate,
    val startTime: LocalTime,
    val endTime: LocalTime?,
    val creator: SmallTeamMemberDTO,
    val members: List<SmallTeamMemberDTO>
)
