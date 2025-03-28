import {Company} from "./companies";
import {ContactPerson} from "./contactperson";
import {Benefit} from "./benefit";

export interface Invoice {
    id?: string;
    company: string;
    contactPerson?: string;
    invoiceDate: Date;
    paymentDeadline: Date;
    status: Status;
    totalAmount: number;
}

export enum Status {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PAID = 'PAID',
}