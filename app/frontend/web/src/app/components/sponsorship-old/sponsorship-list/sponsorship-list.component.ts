import {Component, OnInit} from '@angular/core';
import {Sponsor} from "../../../model/Sponsor";
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription, MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatButton, MatIconButton} from "@angular/material/button";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {SponsorshipListDetailComponent} from "./sponsorship-list-detail/sponsorship-list-detail.component";
import {MatIcon} from "@angular/material/icon";
import {
    SponsorshipContactAddDialogComponent
} from "../../dialogs/sponsorship-contact-add-dialog/sponsorship-contact-add-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
    SponsorshipInvoiceAddDialogComponent
} from "../../dialogs/sponsorship-invoice-add-dialog/sponsorship-invoice-add-dialog.component";
import {
    SponsorshipInvoiceReviewDialogComponent
} from "../../dialogs/sponsorship-invoice-review-dialog/sponsorship-invoice-review-dialog.component";
import {CompanyService} from "../../../services/company.service";
import {CompanyOverviewDTO} from "../../../model/dto/CompanyOverviewDTO";
import {
    SponsorshipStatusDialogComponent
} from "../../dialogs/sponsorship-status-dialog/sponsorship-status-dialog.component";
import {CompanyDetailDTO} from "../../../model/dto/CompanyDetailDTO";
import {CompanyEditDialogComponent} from "../../dialogs/company-edit-dialog/company-edit-dialog.component";
import {Company} from "../../../model/Company";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-sponsorship-list',
    templateUrl: './sponsorship-list.component.html',
    standalone: true,
    imports: [
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatExpansionPanelHeader,
        MatButton,
        CurrencyPipe,
        NgForOf,
        SponsorshipListDetailComponent,
        MatIcon,
        MatIconButton
    ],
    styleUrls: ['./sponsorship-list.component.scss']
})

export class SponsorshipListComponent implements OnInit {
    companies: CompanyOverviewDTO[] = []
    private service: CompanyService

    constructor(public dialog: MatDialog, service: CompanyService, private snackbar: MatSnackBar) {
        this.service = service;
    }

    ngOnInit(): void {
        this.loadCompanies()
    }

    openStatusDialog(company: CompanyOverviewDTO, $event: MouseEvent): void {
        $event.stopPropagation()
        const dialogRef = this.dialog.open(SponsorshipStatusDialogComponent, {
            width: '250px',
            data: { status: company.status }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.companies[this.companies.indexOf(company)].status = result;
            }
        });
    }

    loadCompanies(): void {
        this.service.getCompanyOverview().subscribe({
            next: (data) => this.companies = data,
            error: (error) => console.error('Failed to load companies', error)
        });
    }

    openCreateInvoiceDialog(sponsor: CompanyOverviewDTO, $event: MouseEvent): void {
        $event.stopPropagation()
        const dialogRef = this.dialog.open(SponsorshipInvoiceAddDialogComponent, { width: '600px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openReviewInvoiceDialog(result);
            }
        });
    }

    openReviewInvoiceDialog(invoiceData: any): void {
        this.dialog.open(SponsorshipInvoiceReviewDialogComponent, {
            width: '600px',
            data: invoiceData
        });
    }

    openContactModal(sponsor: CompanyOverviewDTO, $event: MouseEvent): void {
        $event.stopPropagation()
        const dialogRef = this.dialog.open(SponsorshipContactAddDialogComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Contact added:', result);
            }
        });
    }

    openCompanyEditModal(companyOverviewDTO: CompanyOverviewDTO, $event: MouseEvent): void {
        $event.stopPropagation()

        this.service.getCompanyDetail(companyOverviewDTO.id).subscribe({
            next: (company: CompanyDetailDTO) => {
                const dialogRef = this.dialog.open(CompanyEditDialogComponent, {
                    width: '350px',
                    data: company,
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        console.log('Company added:', result);
                        this.snackbar.open('Company successfully added!', 'Close', {
                            duration: 3000
                        });
                    }
                });
            },
            error: (error) => console.error('Failed to load company details', error)
        });


    }
}