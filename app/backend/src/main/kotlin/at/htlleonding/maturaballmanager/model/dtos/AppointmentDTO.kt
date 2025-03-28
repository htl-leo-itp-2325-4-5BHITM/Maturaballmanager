package at.htlleonding.maturaballmanager.model.dtos

import java.time.LocalDate
import java.time.LocalTime

data class AppointmentRequest(
    val name: String,
    val date: LocalDate,
    val startTime: LocalTime?,
    val endTime: LocalTime?,
    val creatorId: String,
    val memberIds: List<Long> = emptyList()
) {
    constructor() : this("", LocalDate.now(), null, null, "")
}

data class AppointmentResponse(
    val id: Long,
    val name: String,
    val date: LocalDate,
    val startTime: LocalTime?,
    val endTime: LocalTime?,
    val creator: SmallTeamMemberDTO,
    val members: List<SmallTeamMemberDTO>
) {
    constructor() : this(-1, "", LocalDate.now(), null, null, SmallTeamMemberDTO(-1, "", ""), emptyList())
}