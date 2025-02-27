package at.htlleonding.maturaballmanager.model.dtos

import java.time.LocalDate
import java.time.LocalTime

data class AppointmentRequest(
    val name: String,
    val date: String,       // Format: "yyyy-MM-dd"
    val startTime: String?,  // z. B. "09:00" oder leer, wenn allDay
    val endTime: String?,    // z. B. "10:00" oder leer, wenn allDay
    val creator: CreatorDTO,
    val members: List<MemberDTO>
){
    constructor() : this(
        name = "",
        date = "",
        startTime = null,
        endTime = null,
        creator = CreatorDTO(id=-1),
        members = emptyList()
    )
}

data class CreatorDTO(
    val id: Long
)

data class MemberDTO(
    val id: Long
)

data class AppointmentResponse(
    val id: Long,
    val name: String,
    val date: LocalDate,
    val startTime: LocalTime?,
    val endTime: LocalTime?,
    val creator: SmallTeamMemberDTO,
    val members: List<SmallTeamMemberDTO>
) {
    constructor() : this(
        id = -1,
        name = "",
        date = LocalDate.now(),
        startTime = null,
        endTime = null,
        creator = SmallTeamMemberDTO(id=-1),
        members = emptyList()
    )
}
