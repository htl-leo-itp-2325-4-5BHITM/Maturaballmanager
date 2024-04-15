import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from "../../../dialogs/confirm-dialog/confirm-dialog.component";
import {CompanyDetailDTO} from "../../../../model/dto/CompanyDetailDTO";
import {ContactPerson} from "../../../../model/ContactPerson";
import {MatIcon} from "@angular/material/icon";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ActivatedRoute, Route} from "@angular/router";
import {CompanyService} from "../../../../services/company.service";

@Component({
  selector: 'app-sponsorship-list-detail',
  templateUrl: './sponsorship-list-detail.component.html',
  standalone: true,
  imports: [
    MatIcon,
    CurrencyPipe,
    NgForOf
  ],
  styleUrls: ['./sponsorship-list-detail.component.scss']
})
export class SponsorshipListDetailComponent implements OnInit {
  company: CompanyDetailDTO = {} as CompanyDetailDTO;
  @Input("id") companyId: number = -1

  constructor(private dialog: MatDialog, private service: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanyDetails();
  }

  loadCompanyDetails(): void {
    this.service.getCompanyDetail(this.companyId).subscribe({
      next: (data) => this.company = data,
      error: (error) => console.error('Failed to load company details', error)
    });
  }


  confirmDelete(item: any, type: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Bestätigung',
        message: `Sind Sie sicher, dass Sie diese ${type} löschen möchten?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteItem(item);
      }
    });
  }

  downloadInvoice(invoiceNumber: string): void {
    console.log(`Downloading invoice #${invoiceNumber}`);
  }

  deleteItem(item: any): void {
    console.log('Deleting item:', item);
    // Implementiere das Löschen aus der Liste
  }

  editContact(contact: ContactPerson): void {
    console.log('Editing contact:', contact);
    // Öffne ein Dialog zum Bearbeiten der Kontaktperson
  }
}
