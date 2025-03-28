package at.htlleonding.maturaballmanager.model.dtos

data class BankAccount(var iban: String? = null, var bic: String? = null, var bankName: String? = null, var accountHolder: String? = null)