import {ContactPersonDTO} from "./contactPerson/ContactPersonDTO";
import {AddressDTO} from "../AddressDTO";
import {InvoiceOverviewDTO} from "./invoices/InvoiceOverviewDTO";

export interface PartnerCompanyDetailDTO {
  id: number,
  companyName: string,
  officeMail: string,
  address: AddressDTO,
  contactPerson: ContactPersonDTO,
  invoices: InvoiceOverviewDTO[]
  revenue: number
}
