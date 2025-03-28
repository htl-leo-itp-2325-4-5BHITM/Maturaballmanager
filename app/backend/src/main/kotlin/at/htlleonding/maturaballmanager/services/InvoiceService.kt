package at.htlleonding.maturaballmanager.services

import EmailTarget
import InvoiceDTO
import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.model.BenefitPdfModel
import at.htlleonding.maturaballmanager.model.InvoicePdfModel
import at.htlleonding.maturaballmanager.model.Status
import at.htlleonding.maturaballmanager.model.dtos.InvoiceSendCheckResult
import at.htlleonding.maturaballmanager.model.entities.Benefit
import at.htlleonding.maturaballmanager.model.entities.Company
import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import at.htlleonding.maturaballmanager.model.entities.Invoice
import at.htlleonding.maturaballmanager.repositories.*
import io.quarkus.hibernate.reactive.panache.common.WithSession
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.quarkus.scheduler.Scheduled
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.NotFoundException
import java.security.SecureRandom
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.*

@ApplicationScoped
class InvoiceService {

    @Inject
    lateinit var invoiceRepository: InvoiceRepository

    @Inject
    lateinit var pdfGeneratorService: PdfGeneratorService

    @Inject
    lateinit var emailService: EmailService

    @Inject
    lateinit var companyRepository: CompanyRepository

    @Inject
    lateinit var contactPersonRepository: ContactPersonRepository

    @Inject
    lateinit var benefitRepository: BenefitRepository

    @Inject
    lateinit var promRepository: PromRepository

    /**
     * Erstellt eine neue Rechnung mit einer benutzerdefinierten ID im Format YYYY####.
     */
    @WithTransaction
    fun createInvoice(invoiceDTO: InvoiceDTO): Uni<InvoiceDTO> {
        return invoiceRepository.getNextManualInvoiceId()
            .flatMap { generatedId ->
                fetchCompany(invoiceDTO.company)
                    .flatMap { company ->
                        fetchContactPerson(invoiceDTO.contactPerson)
                            .flatMap { contactPerson ->
                                fetchBenefits(invoiceDTO.benefits)
                                    .flatMap { benefits ->
                                        val invoiceEntity = Invoice().apply {
                                            id = generatedId
                                            this.company = company
                                            this.contactPerson = contactPerson
                                            this.benefits = benefits.toMutableList()
                                            invoiceDate = invoiceDTO.invoiceDate ?: OffsetDateTime.now()
                                            paymentDeadline = invoiceDTO.paymentDeadline
                                                ?: invoiceDate?.plusDays(14)
                                            status = invoiceDTO.status
                                            totalAmount = benefits.sumOf { it.price }
                                            prom = company.prom
                                        }

                                        invoiceRepository.persist(invoiceEntity)
                                            .map { it.toDTO() }
                                    }
                            }
                    }
            }
    }

    fun checkIfInvoiceIsSendable(id: String): Uni<InvoiceSendCheckResult> {
        return findInvoice(id)
            .map { invoice ->

                val missingFields = mutableListOf<String>()

                if (invoice.company == null) {
                    missingFields.add("Firma (company) fehlt.")
                } else {
                    if (invoice.company?.name.isNullOrBlank()) {
                        missingFields.add("Firmenname fehlt.")
                    }
                    val address = invoice.company?.address
                    if (address == null) {
                        missingFields.add("Firmenadresse fehlt.")
                    } else {
                        if (address.street.isNullOrBlank()) missingFields.add("Straße in Firmenadresse fehlt.")
                        if (address.houseNumber.isNullOrBlank()) missingFields.add("Hausnummer in Firmenadresse fehlt.")
                        if (address.postalCode.isNullOrBlank()) missingFields.add("PLZ in Firmenadresse fehlt.")
                        if (address.city.isNullOrBlank()) missingFields.add("Ort in Firmenadresse fehlt.")
                    }

                    // TODO: Make better email check (only check if officeEmail is used to send)
                    /*
                    if (invoice.company?.officeEmail.isNullOrBlank()) {
                        missingFields.add("Büro-E-Mail fehlt.")
                    }
                     */
                }

                if (invoice.contactPerson != null) {
                    if (invoice.contactPerson?.firstName.isNullOrBlank()) {
                        missingFields.add("Vorname der Kontaktperson fehlt.")
                    }
                    if (invoice.contactPerson?.lastName.isNullOrBlank()) {
                        missingFields.add("Nachname der Kontaktperson fehlt.")
                    }
                    if (invoice.contactPerson?.personalEmail.isNullOrBlank()) {
                        missingFields.add("E-Mail der Kontaktperson fehlt.")
                    }
                    if (invoice.contactPerson?.gender.isNullOrBlank()) {
                        missingFields.add("Geschlecht der Kontaktperson fehlt (M|W|D).")
                    }
                    if (invoice.contactPerson?.position.isNullOrBlank()) {
                        missingFields.add("Position der Kontaktperson fehlt.")
                    }
                }

                if (invoice.invoiceDate == null) {
                    missingFields.add("Rechnungsdatum fehlt.")
                }
                if (invoice.paymentDeadline == null) {
                    missingFields.add("Zahlungsfrist fehlt.")
                }

                if (invoice.totalAmount == null || invoice.totalAmount == 0.0) {
                    missingFields.add("Rechnungsbetrag (totalAmount) fehlt oder ist 0.")
                }

                if (missingFields.isEmpty()) {
                    InvoiceSendCheckResult(
                        isValid = true,
                        message = "Alle erforderlichen Felder sind befüllt.",
                    )
                } else {
                    InvoiceSendCheckResult(
                        isValid = false,
                        message = "Es fehlen Pflichtfelder zum Versenden der Rechnung.",
                        missingFields = missingFields
                    )
                }
            }
    }


    /**
     * Updates an existing invoice.
     */
    @WithTransaction
    fun updateInvoice(id: String, invoiceDTO: InvoiceDTO): Uni<InvoiceDTO> {
        return findInvoice(id)
            .flatMap { existingInvoice ->
                fetchCompany(invoiceDTO.company)
                    .flatMap { company ->
                        existingInvoice.company = company
                        fetchContactPerson(invoiceDTO.contactPerson)
                            .flatMap { contactPerson ->
                                existingInvoice.contactPerson = contactPerson
                                fetchBenefits(invoiceDTO.benefits)
                                    .flatMap { benefits ->
                                        existingInvoice.benefits = benefits.toMutableList()
                                        existingInvoice.invoiceDate =
                                            invoiceDTO.invoiceDate ?: existingInvoice.invoiceDate
                                        existingInvoice.paymentDeadline =
                                            invoiceDTO.paymentDeadline ?: existingInvoice.invoiceDate?.plusDays(14)
                                        existingInvoice.status = invoiceDTO.status
                                        existingInvoice.totalAmount = benefits.sumOf { it.price }

                                        existingInvoice.sendOption = invoiceDTO.sendOption ?: existingInvoice.sendOption
                                        invoiceRepository.persist(existingInvoice)
                                    }
                            }
                    }
            }
            .map { it.toDTO() }
            .onFailure().invoke { throwable ->
                // Optional: Add logging here
                // logger.error("Failed to update invoice", throwable)
            }
    }

    /**
     * Fetches the Company entity by ID.
     */
    fun fetchCompany(companyId: String?): Uni<Company> {
        return if (companyId == null) {
            Uni.createFrom().failure<Company>(IllegalArgumentException("Company ID is required"))
        } else {
            companyRepository.findById(companyId)
                .onItem().ifNull().failWith { IllegalArgumentException("Company not found with ID: $companyId") }
        }
    }


    /**
     * Fetches the ContactPerson entity by ID, if provided.
     */
    fun fetchContactPerson(contactPersonId: String?): Uni<ContactPerson?> {
        return if (contactPersonId != null) {
            contactPersonRepository.findById(contactPersonId)
                .onItem().ifNull().failWith { IllegalArgumentException("ContactPerson not found with ID: $contactPersonId") }
        } else {
            Uni.createFrom().nullItem<ContactPerson>()
        }
    }

    /**
     * Fetches a list of Benefit entities by their IDs using batch fetching.
     */
    private fun fetchBenefits(benefitIds: List<String>): Uni<List<Benefit>> {
        return if (benefitIds.isEmpty()) {
            Uni.createFrom().item(emptyList())
        } else {
            benefitRepository.findAllByIds(benefitIds)
                .flatMap { benefits ->
                    if (benefits.size != benefitIds.size) {
                        val foundIds = benefits.map { it.id }
                        val missingIds = benefitIds.filterNot { it in foundIds }
                        Uni.createFrom().failure<List<Benefit>>(
                            IllegalArgumentException("Benefits not found for IDs: $missingIds")
                        )
                    } else {
                        Uni.createFrom().item(benefits)
                    }
                }
        }
    }


    /**
     * Creates an Invoice entity from the DTO and persists it.
     */
    fun createAndPersistInvoice(
        invoiceDTO: InvoiceDTO,
        uniqueId: String,
        company: Company,
        contactPerson: ContactPerson?,
        benefits: List<Benefit>,
    ): Uni<InvoiceDTO> {
        val invoice = Invoice().apply {
            id = uniqueId
            this.company = company
            this.contactPerson = contactPerson
            this.benefits = benefits.toMutableList()
            invoiceDate = invoiceDTO.invoiceDate ?: OffsetDateTime.now()
            paymentDeadline = invoiceDTO.paymentDeadline ?: invoiceDate?.plusDays(14)
            status = invoiceDTO.status
            totalAmount = benefits.sumOf { it.price }
            prom = company.prom
            sendOption = invoiceDTO.sendOption ?: "immediate"
        }

        return promRepository.findLastActiveProm()
            .onItem().ifNull().failWith(IllegalStateException("No active Prom found"))
            .flatMap { activeProm ->
                company.prom = activeProm
                invoiceRepository.persist(invoice)
                    .flatMap { persistedInvoice ->
                        Uni.createFrom().item(persistedInvoice.toDTO())
                    }
            }
    }

    /**
     * Generates a unique 16-digit invoice number.
     */
    private fun generateUniqueInvoiceNumber(): Uni<String> {
        val random = SecureRandom()
        return Uni.createFrom().deferred {
            generateUniqueInvoiceNumberRecursive(random)
        }
    }

    private fun generateUniqueInvoiceNumberRecursive(random: SecureRandom, attempts: Int = 0): Uni<String> {
        if (attempts > 10) {
            return Uni.createFrom().failure(IllegalStateException("Failed to generate unique invoice number"))
        }

        val invoiceNumber = (1..16)
            .map { random.nextInt(10) }
            .joinToString("")

        return invoiceRepository.existsByInvoiceNumber(invoiceNumber)
            ?.flatMap { exists ->
                if (exists) {
                    generateUniqueInvoiceNumberRecursive(random, attempts + 1)
                } else {
                    Uni.createFrom().item(invoiceNumber)
                }
            } ?: Uni.createFrom().failure(IllegalStateException("Failed to check if invoice number exists"))
    }

    /**
     * Deletes an invoice by ID.
     */
    @WithTransaction
    fun deleteInvoice(id: String): Uni<Boolean> {
        return invoiceRepository.delete("id", id).map { it > 0 }
    }

    /**
     * Finds all invoices.
     */
    fun findAllInvoices(): Uni<List<InvoiceDTO>> {
        return promRepository.findLastActiveProm().flatMap { prom ->
            if (prom != null) {
                invoiceRepository.findAllByProm(prom).map { invoices ->
                    invoices.map { it.toDTO() }
                }
            } else {
                Uni.createFrom().item(emptyList())
            }
        }
    }

    /**
     * Finds an invoice by ID.
     */
    fun findInvoice(id: String): Uni<Invoice> {
        return invoiceRepository.find("id", id).singleResult<Invoice>().flatMap {
            if (it == null) {
                Uni.createFrom().failure(NotFoundException("Invoice not found with ID: $id"))
            } else {
                Uni.createFrom().item(it)
            }
        }
    }

    /**
     * Sendet eine Rechnung an eine spezifische E-Mail-Adresse basierend auf der Zielauswahl.
     * @param id ID der Rechnung
     * @param target Ziel der E-Mail (OFFICE oder CONTACT_PERSON)
     */
    @WithTransaction
    fun sendInvoice(id: String, target: EmailTarget): Uni<Void> {
        return findInvoice(id)
            .flatMap { invoice ->
                println("Debug: invoice.contactPerson = ${invoice.contactPerson}")
                println("Debug: invoice.contactPerson?.personalEmail = ${invoice.contactPerson?.personalEmail}")

                val recipient = when (target) {
                    EmailTarget.OFFICE -> invoice.company?.officeEmail
                    EmailTarget.CONTACT_PERSON -> invoice.contactPerson?.personalEmail
                }

                if (recipient.isNullOrBlank()) {
                    Uni.createFrom().failure<Void>(
                        IllegalArgumentException("Die ausgewählte E-Mail-Adresse ist nicht verfügbar.")
                    )
                } else if (!isValidEmail(recipient)) {
                    Uni.createFrom().failure<Void>(
                        IllegalArgumentException("Die ausgewählte E-Mail-Adresse ist ungültig.")
                    )
                } else {
                    emailService.sendInvoiceEmail(invoice, recipient)
                        .flatMap {
                            invoice.status = Status.SENT
                            invoiceRepository.persist(invoice).replaceWithVoid()
                        }
                }
            }
            .onFailure().invoke { throwable ->
                // Optional: Loggen Sie den Fehler
            }
    }

    /**
     * Überprüft die Gültigkeit der E-Mail-Adresse.
     */
    private fun isValidEmail(email: String): Boolean {
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$".toRegex()
        return email.matches(emailRegex)
    }

    /**
     * Generiert ein PDF für eine Rechnung (ID).
     * Dabei laden wir alle notwendigen DB-Felder in ein eigenes Model (InvoicePdfModel).
     * Anschließend geben wir das Model an pdfGeneratorService, OHNE weitere DB-Zugriffe.
     */
    @WithSession
    fun preparePdfModel(id: String): Uni<InvoicePdfModel> {
        return findInvoice(id)
            .map { invoice ->
                createInvoicePdfModel(invoice)
            }
    }

    fun generateInvoicePdf(id: String, senderName: String, isCopy: Boolean = false): Uni<ByteArray> {
        return preparePdfModel(id)
            .flatMap { model ->
                pdfGeneratorService.generateInvoicePdf(model, senderName, isCopy)
            }
    }


    /**
     * Baut das PDF-Model, damit wir im Worker-Thread nichts mehr aus der DB laden müssen.
     */
    fun createInvoicePdfModel(invoice: Invoice): InvoicePdfModel {
        val comp = invoice.company
        val address = comp?.address
        val contact = invoice.contactPerson

        val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        val invoiceDateStr = invoice.invoiceDate?.format(dateFormatter) ?: ""
        val deadlineStr = invoice.paymentDeadline?.format(dateFormatter) ?: ""

        val benefitsList = invoice.benefits.map { b ->
            BenefitPdfModel(
                name = b.name ?: "",
                description = b.description ?: "",
                price = b.price
            )
        }

        return InvoicePdfModel(
            id = invoice.id ?: "",
            companyName = comp?.name ?: "",
            companyStreet = address?.street ?: "",
            companyHouseNumber = address?.houseNumber ?: "",
            companyPostalCode = address?.postalCode ?: "",
            companyCity = address?.city ?: "",

            contactPersonName = if (contact != null) "${contact.firstName} ${contact.lastName}" else null,
            invoiceDate = invoiceDateStr,
            paymentDeadline = deadlineStr,
            totalAmount = invoice.totalAmount ?: 0.0,
            status = invoice.status.name,
            sendOption = invoice.sendOption,
            benefits = benefitsList
        )
    }

    /**
     * Führt täglich um Mitternacht die Überprüfung aller Rechnungen durch,
     * ob deren Rechnungsdatum erreicht ist (invoiceDate <= Heute)
     * und ob sendOption = 'onDate' ist. Dann versenden wir automatisch die E-Mail.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    fun checkAndSendInvoices() {
        sendInvoicesWhichAreDue()
            .subscribe().with(
                { },
                {}
            )
    }

    @WithTransaction
    fun sendInvoicesWhichAreDue(): Uni<Void> {
        val today = OffsetDateTime.now(ZoneOffset.UTC).toLocalDate()

        return invoiceRepository
            .find("sendOption = ?1", "onDate")
            .list<Invoice>()
            .flatMap { allOnDateInvoices ->
                val dueInvoices = allOnDateInvoices.filter { inv ->
                    inv.invoiceDate?.toLocalDate()?.isBefore(today.plusDays(1)) == true &&
                            inv.status == Status.DRAFT
                }

                if (dueInvoices.isEmpty()) {
                    Uni.createFrom().voidItem()
                } else {
                    val sendUnis = dueInvoices.map { invoice ->
                        val emailTarget = invoice.company?.officeEmail
                            ?: invoice.contactPerson?.personalEmail
                            ?: return@map Uni.createFrom().voidItem()

                        emailService.sendInvoiceEmail(invoice, emailTarget)
                            .flatMap {
                                invoice.status = Status.SENT
                                invoiceRepository.persist(invoice)
                            }
                            .replaceWithVoid()
                    }

                    Uni.join().all(sendUnis)
                        .andFailFast()
                        .onItem().transform { _: List<Void> ->
                        }
                        .flatMap {
                            Uni.createFrom().voidItem()
                        }
                }
            }
    }

    @WithTransaction
    fun markInvoiceAsPaid(invoiceId: String): Uni<InvoiceDTO> {
        return findInvoice(invoiceId)
            .flatMap { invoice ->
                invoice.status = Status.PAID
                invoiceRepository.persist(invoice)
            }
            .map { it.toDTO() }
    }

}
