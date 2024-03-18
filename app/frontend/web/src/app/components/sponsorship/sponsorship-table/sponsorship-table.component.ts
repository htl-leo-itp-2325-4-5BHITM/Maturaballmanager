import {Component, Inject, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {SponsorshipTableItemComponent} from "../sponsorship-table-item/sponsorship-table-item.component";
import {PartnerCompanyService} from "../../../services/partnercompany/partner-company.service";
import {PartnerCompanyOverviewDTO} from "../../../model/partnerCompany/PartnerCompanyOverviewDTO";

@Component({
  selector: 'app-sponsorship-table',
  standalone: true,
  imports: [
    NgForOf,
    SponsorshipTableItemComponent
  ],
  providers: [PartnerCompanyService],
  templateUrl: './sponsorship-table.component.html',
  styleUrl: './sponsorship-table.component.css'
})
export class SponsorshipTableComponent implements OnInit {
  protected companies: PartnerCompanyOverviewDTO[];
  @Inject(PartnerCompanyService) private service: PartnerCompanyService

  constructor(service: PartnerCompanyService) {
    this.companies = [];
    this.service = service;
  }

  ngOnInit() {
    this.service.getPartnerCompanyOverview().then((data: PartnerCompanyOverviewDTO[]) => {
      this.companies = data;
    });
  }
}
