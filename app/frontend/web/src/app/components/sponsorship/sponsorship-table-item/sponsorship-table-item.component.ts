import { Component, Input } from '@angular/core';
import { PartnerCompanyService } from "../../../services/partnercompany/partner-company.service";
import { PartnerCompanyDetailDTO } from "../../../model/partnerCompany/PartnerCompanyDetailDTO";
import { PartnerCompanyOverviewDTO } from "../../../model/partnerCompany/PartnerCompanyOverviewDTO";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sponsorship-table-item',
  templateUrl: './sponsorship-table-item.component.html',
  styleUrls: ['./sponsorship-table-item.component.scss'],
  imports: [
    NgIf
  ],
  standalone: true
})
export class SponsorshipTableItemComponent {
  // @ts-ignore
  @Input() company: PartnerCompanyOverviewDTO;
  detailsVisible: boolean = false;
  companyDetails?: PartnerCompanyDetailDTO;

  constructor(private service: PartnerCompanyService) {}

  toggleDetails() {
    if (!this.detailsVisible) {
      this.service.getCompanyDetails(this.company.id).then(details => {
        this.companyDetails = details;
        this.detailsVisible = true;
      }).catch(error => {
        console.error("Fehler beim Abrufen der Unternehmensdetails", error);
      });
    } else {
      this.detailsVisible = false;
    }
  }

}
