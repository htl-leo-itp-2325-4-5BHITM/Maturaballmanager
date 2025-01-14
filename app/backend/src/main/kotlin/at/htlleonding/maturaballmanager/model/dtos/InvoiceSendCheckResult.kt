package at.htlleonding.maturaballmanager.model.dtos

import jakarta.json.bind.annotation.JsonbProperty

data class InvoiceSendCheckResult(
    @JsonbProperty("isValid")
    val isValid: Boolean,

    val message: String,
    val missingFields: List<String> = emptyList()
)