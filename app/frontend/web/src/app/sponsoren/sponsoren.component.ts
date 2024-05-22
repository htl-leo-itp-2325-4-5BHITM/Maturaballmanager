import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgForOf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { SponsorshipInvoiceAddDialogComponent } from "../components/dialogs/sponsorship-invoice-add-dialog/sponsorship-invoice-add-dialog.component";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { SponsorshipListDetailComponent } from "../components/sponsorship/sponsorship-list/sponsorship-list-detail/sponsorship-list-detail.component";
import { CompanyOverviewDTO } from "../model/dto/CompanyOverviewDTO";
import { CompanyService } from "../services/company.service";
import { SponsorshipStatusDialogComponent } from "../components/dialogs/sponsorship-status-dialog/sponsorship-status-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SponsorshipInvoiceReviewDialogComponent } from "../components/dialogs/sponsorship-invoice-review-dialog/sponsorship-invoice-review-dialog.component";
import { SponsorshipContactAddDialogComponent } from "../components/dialogs/sponsorship-contact-add-dialog/sponsorship-contact-add-dialog.component";
import { CompanyEditDialogComponent } from "../components/dialogs/company-edit-dialog/company-edit-dialog.component";
import { CompanyDetailDTO } from "../model/dto/CompanyDetailDTO";
import { matBottomSheetAnimations } from "@angular/material/bottom-sheet";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-sponsoren',
  templateUrl: './sponsoren.component.html',
  styleUrls: ['./sponsoren.component.scss'], // Corrected to styleUrls
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    CurrencyPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    NgForOf,
    SponsorshipListDetailComponent,
    MatProgressBar
  ]
})

export class SponsorshipListComponent implements OnInit {
  companies: CompanyOverviewDTO[] = []
  private service: CompanyService

  constructor(public dialog: MatDialog, service: CompanyService, private snackbar: MatSnackBar) {
    this.service = service;
  }
  public boxes = [
    { title: 'Status', cols: 1, rows: 1 },
    { title: 'Prozentanteil', cols: 1, rows: 1 },
    { title: 'Rechnungen', cols: 2, rows: 2 },
  ];

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

  protected readonly matBottomSheetAnimations = matBottomSheetAnimations;
}
