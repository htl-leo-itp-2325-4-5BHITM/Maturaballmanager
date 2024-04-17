export interface InvoiceOverview {
    id: number
    bookingDate: Date
    dueDate: Date
    revenue: number
    status: InvoiceStatus
}

export enum InvoiceStatus {
    PAID, UNPAID, PENDING
}