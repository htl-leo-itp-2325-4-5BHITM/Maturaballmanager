// Import statements...
import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {PartnerCompanyService} from "../../../services/partnercompany/partner-company.service";
import {PartnerCompanyDetailDTO} from "../../../model/partnerCompany/PartnerCompanyDetailDTO";
import {PartnerCompanyOverviewDTO} from "../../../model/partnerCompany/PartnerCompanyOverviewDTO";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {ModalService} from "../../../services/modal.service";

@Component({
    selector: 'app-sponsorship-table-item',
    templateUrl: './sponsorship-table-item.component.html',
    styleUrls: ['./sponsorship-table-item.component.scss'],
    imports: [
        NgIf,
        NgForOf,
        CurrencyPipe,
        DatePipe
    ],
    standalone: true
})
export class SponsorshipTableItemComponent implements OnInit {
    @Input() company: PartnerCompanyOverviewDTO = {} as PartnerCompanyOverviewDTO;
    details: PartnerCompanyDetailDTO = {} as PartnerCompanyDetailDTO
    isExpanded: boolean = false;

    constructor(private partnerCompanyService: PartnerCompanyService, private modalService: ModalService) {}

    // opens the modal
    openModal(modalTemplate: TemplateRef<any>) {
        this.modalService
            .open(modalTemplate, { size: 'lg', title: 'Foo' })
            .subscribe((action) => {
                console.log('modalAction', action);
            });
    }

    ngOnInit(): void {}

    toggleDetails(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
        }

        if (!this.isExpanded && this.details.id === undefined) {
            this.partnerCompanyService.getCompanyDetails(this.company.id).then((data) => {
                this.details = data;
                this.isExpanded = true;
            });
        } else {
            this.isExpanded = !this.isExpanded;
        }
    }

    addInvoice() {

    }

}
