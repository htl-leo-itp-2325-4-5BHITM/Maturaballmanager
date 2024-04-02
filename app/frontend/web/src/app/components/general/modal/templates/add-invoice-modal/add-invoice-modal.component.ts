import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PartnerCompanyService} from "../../../../../services/partnercompany/partner-company.service";
import {TemplateItem} from "../../../../../model/partnerCompany/invoices/TemplateItem";

@Component({
    selector: 'app-add-invoice-modal',
    standalone: true,
    imports: [
        NgForOf,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './add-invoice-modal.component.html',
    styleUrl: './add-invoice-modal.component.scss'
})

export class AddInvoiceModalComponent implements OnInit {
    private service: PartnerCompanyService;
    protected templateItems: TemplateItem[] = [];

    constructor(service: PartnerCompanyService) {
        this.service = service;
    }

    ngOnInit() {
        this.getTemplateItems();
    }

    getTemplateItems() {
        console.log('Getting template items');
        this.service.getTemplateItems().subscribe((data: TemplateItem[]) => {
            this.templateItems = data;
        });
    }
}
