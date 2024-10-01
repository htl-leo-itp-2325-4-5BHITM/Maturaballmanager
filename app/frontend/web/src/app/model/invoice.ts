import {Company} from "./companies";
import {Benefit} from "./benefit";
import {ContactPerson} from "./contactperson";

export interface Invoice {
    id?: string;
    company: Company;
    contactPerson?: ContactPerson | null;
    benefits: Benefit[];
    invoiceDate: Date;
    paymentDeadline: Date;
    status: Status;
    totalAmount: number;
}

export enum Status {
    DRAFT = 'draft',
    SENT = 'sent',
    PAID = 'paid',
}
