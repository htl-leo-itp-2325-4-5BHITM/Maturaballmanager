import {Injectable} from '@angular/core';
import {PartnerCompanyOverviewDTO} from "../../model/partnerCompany/PartnerCompanyOverviewDTO";
import {apiUrl} from "../../app.config";
import {PartnerCompanyDetailDTO} from "../../model/partnerCompany/PartnerCompanyDetailDTO";

@Injectable({
  providedIn: 'root'
})
export class PartnerCompanyService {

  constructor() {}

  async getPartnerCompanyOverview(): Promise<PartnerCompanyOverviewDTO[]> {
    const data: Response = await fetch(`${apiUrl}/companies/overview`);
    return await data.json() ?? [];
  }

  async getCompanyDetails(id: number): Promise<PartnerCompanyDetailDTO> {
    const data: Response = await fetch(`${apiUrl}/companies/detail/${id}`);
    return await data.json() ?? {};
  }
}
