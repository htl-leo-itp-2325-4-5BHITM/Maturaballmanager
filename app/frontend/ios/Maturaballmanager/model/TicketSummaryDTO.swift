struct TicketSummaryDTO: Codable {
    var customer: Customer
    var issuer: String
    var signature: String
}
