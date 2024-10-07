import {Company} from "./companies";
import {ContactPerson} from "./contactperson";
import {Benefit} from "./benefit";

export interface Invoice {
    id?: string;
    invoiceNumber?: string;
    company: Company;
    contactPerson?: ContactPerson;
    benefits: Benefit[];
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