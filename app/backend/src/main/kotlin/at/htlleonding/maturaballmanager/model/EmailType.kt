data class SendInvoiceRequest(
    var target: EmailTarget
) {
    constructor() : this(EmailTarget.OFFICE)
}

enum class EmailTarget {
    OFFICE,
    CONTACT_PERSON
}