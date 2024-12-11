package at.htlleonding.maturaballmanager.services

import at.htlleonding.maturaballmanager.configs.toDTO
import at.htlleonding.maturaballmanager.configs.toEntity
import at.htlleonding.maturaballmanager.model.Status
import at.htlleonding.maturaballmanager.model.dtos.InvoiceDTO
import at.htlleonding.maturaballmanager.model.entities.Benefit
import at.htlleonding.maturaballmanager.model.entities.Company
import at.htlleonding.maturaballmanager.model.entities.ContactPerson
import at.htlleonding.maturaballmanager.model.entities.Invoice
import at.htlleonding.maturaballmanager.repositories.BenefitRepository
import at.htlleonding.maturaballmanager.repositories.CompanyRepository
import at.htlleonding.maturaballmanager.repositories.ContactPersonRepository
import at.htlleonding.maturaballmanager.repositories.InvoiceRepository
import io.quarkus.hibernate.reactive.panache.common.WithTransaction
import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.NotFoundException
import org.hibernate.Hibernate
import java.security.SecureRandom
import java.time.OffsetDateTime
import java.util.UUID

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

    /**
     * Creates a new invoice.
     */
    @WithTransaction
    fun createInvoice(invoiceDTO: InvoiceDTO): Uni<InvoiceDTO> {
        return generateUniqueInvoiceNumber()
            .flatMap { uniqueNumber ->
                fetchCompany(invoiceDTO.company)
                    .flatMap { company ->
                        fetchContactPerson(invoiceDTO.contactPerson)
                            .map { contactPerson ->
                                Triple(uniqueNumber, company, contactPerson)
                            }
                    }
            }
            .flatMap { (uniqueNumber, company, contactPerson) ->
                fetchBenefits(invoiceDTO.benefits)
                    .flatMap { benefits ->
                        createAndPersistInvoice(invoiceDTO, uniqueNumber, company, contactPerson, benefits)
                    }
            }
            .onFailure().invoke { throwable ->
                // Optional: Add logging here
                // logger.error("Failed to create invoice", throwable)
            }
    }


    /**
     * Updates an existing invoice.
     */
    @WithTransaction
    fun updateInvoice(id: UUID, invoiceDTO: InvoiceDTO): Uni<InvoiceDTO> {
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
                                        existingInvoice.totalAmount = benefits.sumOf { it.price ?: 0.0 }

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
        return if (contactPersonId == null) {
            Uni.createFrom().item<ContactPerson?>(null)
        } else {
            contactPersonRepository.findById(contactPersonId)
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
                .onItem().invoke { benefits ->
                }
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
        uniqueNumber: String,
        company: Company,
        contactPerson: ContactPerson?,
        benefits: List<Benefit>
    ): Uni<InvoiceDTO> {
        val invoice = Invoice().apply {
            invoiceNumber = uniqueNumber
            this.company = company
            this.contactPerson = contactPerson
            this.benefits = benefits.toMutableList()
            invoiceDate = invoiceDTO.invoiceDate ?: OffsetDateTime.now()
            paymentDeadline = invoiceDTO.paymentDeadline ?: invoiceDate?.plusDays(14)
            status = invoiceDTO.status
            totalAmount = benefits.sumOf { it.price ?: 0.0 }
        }

        return invoiceRepository.persist(invoice)
            .map { persistedInvoice ->
                persistedInvoice.toDTO()
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
            .flatMap { exists ->
                if (exists) {
                    generateUniqueInvoiceNumberRecursive(random, attempts + 1)
                } else {
                    Uni.createFrom().item(invoiceNumber)
                }
            }
    }

    /**
     * Deletes an invoice by ID.
     */
    @WithTransaction
    fun deleteInvoice(id: UUID): Uni<Boolean> {
        return invoiceRepository.deleteById(id)
    }

    /**
     * Finds all invoices.
     */
    fun findAllInvoices(): Uni<List<InvoiceDTO>> {
        return invoiceRepository.findAll().list<Invoice>().map { it.map { it.toDTO() } }
    }

    /**
     * Finds an invoice by ID.
     */
    fun findInvoice(id: UUID): Uni<Invoice> {
        return invoiceRepository.find("id", id).singleResult()
            ?: Uni.createFrom().failure(NotFoundException("Invoice not found"))
    }

    /**
     * Sends an invoice via email.
     */
    @WithTransaction
    fun sendInvoiceByEmail(id: UUID): Uni<Void> {
        return findInvoice(id)
            .flatMap { invoice ->
                emailService.sendInvoiceEmail(invoice)
                    .flatMap {
                        invoice.status = Status.SENT
                        invoiceRepository.persist(invoice).replaceWithVoid()
                    }
            }
            .onFailure().invoke { throwable ->
            }
    }

    /**
     * Generates a PDF for the given invoice.
     */
    fun generateInvoicePdf(id: UUID, senderName: String): Uni<ByteArray> {
        return findInvoice(id)
            .flatMap { invoice ->
                pdfGeneratorService.generateInvoicePdf(invoice, senderName)
            }
            .onFailure().invoke { throwable ->
            }
    }
}