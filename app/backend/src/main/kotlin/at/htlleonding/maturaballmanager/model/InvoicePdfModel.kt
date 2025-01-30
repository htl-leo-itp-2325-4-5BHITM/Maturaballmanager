package at.htlleonding.maturaballmanager.model

data class InvoicePdfModel(
    val id: String,
    val companyName: String,
    val companyStreet: String,
    val companyHouseNumber: String,
    val companyPostalCode: String,
    val companyCity: String,

    val contactPersonName: String?,
    val invoiceDate: String,
    val paymentDeadline: String,
    val totalAmount: Double,
    val status: String,
    val sendOption: String?,
    val benefits: List<BenefitPdfModel>
)

data class BenefitPdfModel(
    val name: String,
    val description: String,
    val price: Double
)