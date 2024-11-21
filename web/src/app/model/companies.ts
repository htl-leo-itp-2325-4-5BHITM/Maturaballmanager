import {ContactPerson} from "./contactperson";

export interface Address {
    street?: string;
    houseNumber?: string;
    floor?: string;
    door?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface Company {
    id?: string;
    name: string;
    industry: string;
    website?: string;
    officeEmail?: string;
    officePhone?: string;
    totalRevenue?: number;
    invoiceCount?: number;
    address?: Address;
    contactPersons?: ContactPerson[];
}