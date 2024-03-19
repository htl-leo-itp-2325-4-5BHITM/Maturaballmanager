import {Component, OnInit, TemplateRef} from '@angular/core';
import {PartnerCompanyOverviewDTO} from "../../../model/partnerCompany/PartnerCompanyOverviewDTO";
import {PartnerCompanyService} from "../../../services/partnercompany/partner-company.service";
import {SponsorshipTableItemComponent} from "../sponsorship-table-item/sponsorship-table-item.component";
import {NgForOf} from "@angular/common";
@Component({
  selector: 'app-sponsorship-table',
  templateUrl: './sponsorship-table.component.html',
  standalone: true,
  imports: [SponsorshipTableItemComponent, NgForOf],
  styleUrls: ['./sponsorship-table.component.scss']
})
export class SponsorshipTableComponent implements OnInit {
  companies: PartnerCompanyOverviewDTO[] = [];

  constructor(private partnerCompanyService: PartnerCompanyService) {}

  ngOnInit(): void {
    this.partnerCompanyService.getPartnerCompanyOverview().then(companies => {
        this.companies = companies;
    });
  }
}
