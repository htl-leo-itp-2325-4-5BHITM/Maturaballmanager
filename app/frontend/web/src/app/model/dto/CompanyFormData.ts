import {Address} from "../Address";
import {ContactPerson} from "../ContactPerson";

export interface CompanyFormData {
    id: number | null;
    companyName: string;
    website: string;
    officeMail: string;
    officePhone: string;
    includeAddress: boolean;
    address: Address | null;
    includeContactPersons: boolean;
    contactPersons: ContactPerson[];
}
