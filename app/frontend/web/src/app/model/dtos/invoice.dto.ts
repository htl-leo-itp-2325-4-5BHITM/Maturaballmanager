import {Invoice, Status} from "../invoice";

export interface InvoiceDTO {
    id?: string;
    company?: string;
    contactPerson?: string;
    benefits?: string[];
    invoiceDate?: Date;
    paymentDeadline?: Date;
    status?: Status;
    totalAmount?: number;
    sendOption?: 'immediate' | 'onDate';
}
