import at.htlleonding.maturaballmanager.model.Status
import java.time.OffsetDateTime
import java.util.*

data class InvoiceDTO(
    var id: UUID? = null,
    var invoiceNumber: String? = null,

    var company: String? = null,
    var contactPerson: String? = null,

    var companyName: String? = null,
    var contactPersonName: String? = null,

    var benefits: List<String> = emptyList(),
    var invoiceDate: OffsetDateTime? = null,
    var paymentDeadline: OffsetDateTime? = null,
    var status: Status = Status.DRAFT,
    var totalAmount: Double? = 0.0,
    var sendOption: String? = "immediate"
)