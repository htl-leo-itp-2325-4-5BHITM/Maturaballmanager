import {Address} from "../Address";
import {ContactPerson} from "../ContactPerson";
import {InvoiceOverview} from "./InvoiceOverviewDTO";

export interface CompanyDetailDTO {
    id: number;
    companyName: string;
    website: string;
    officeMail: string;
    officePhone: string;
    address: Address;
    contactPersons: ContactPerson[];
    invoices: InvoiceOverview[];
}