// src/app/components/invoice-management/invoice-management.component.ts

import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbSelectModule,
  NbToastrService,
  NbTooltipModule,
  NbTagModule,
  NbBadgeModule
} from '@nebular/theme';
import { saveAs } from 'file-saver';
import { NgxPaginationModule } from 'ngx-pagination';
import { Invoice, Status } from "../../model/invoice";
import { ConfirmDialogComponent } from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import { InvoiceDialogComponent } from "../../components/dialogs/invoice-dialog/invoice-dialog.component";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {ReportComponent} from "../../components/report/report.component";

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss'],
  standalone: true,
  imports: [
    NgxPaginationModule,
    NbTagModule,
    NbOptionModule,
    NbSelectModule,
    NgIf,
    NbIconModule,
    NbButtonModule,
    NbTooltipModule,
    DatePipe,
    NgForOf,
    NbFormFieldModule,
    NbCardModule,
    NbInputModule,
    InvoiceDialogComponent,
    ConfirmDialogComponent,
    CurrencyPipe,
    NbBadgeModule,
    ReportComponent,
  ]
})
export class InvoiceManagementComponent implements OnInit {
  invoices: Invoice[] = [];

  columns = [
    { key: 'invoiceNumber', title: 'ID', sortable: true },
    { key: 'company', title: 'Firma', sortable: true, format: (value: any) => value.name || '—' },
    {
      key: 'contactPerson',
      title: 'Kontaktperson',
      format: (value: any) => (value ? `${value.firstName} ${value.lastName}` : '—'),
    },
    {
      key: 'invoiceDate',
      title: 'Rechnungsdatum',
      sortable: true,
      format: (value: any) => (value ? new Date(value).toLocaleDateString('de-DE') : '—'),
    },
    {
      key: 'paymentDeadline',
      title: 'Zahlungsfrist',
      format: (value: any) => (value ? new Date(value).toLocaleDateString('de-DE') : '—'),
    },
    {
      key: 'totalAmount',
      title: 'Betrag',
      format: (value: any) => (value ? `${value.toFixed(2)} €` : '—'),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      format: (value: any) => this.getStatusBadge(value),
    },
  ];

  actions = [
    {
      icon: 'trash-2-outline',
      tooltip: 'Rechnung löschen',
      status: 'danger',
      callback: this.confirmDelete.bind(this),
    },
    {
      icon: 'email-outline',
      tooltip: 'Rechnung versenden',
      status: 'success',
      callback: this.sendInvoice.bind(this),
      disabled: (row: Invoice) => row.status === Status.SENT || row.status === Status.PAID,
    },
    {
      icon: 'download-outline',
      tooltip: 'PDF herunterladen',
      status: 'primary',
      callback: this.downloadPdf.bind(this),
    },
  ];

  constructor(
      private invoiceService: InvoiceService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
      },
      error: (error) => {
        this.toastrService.danger('Fehler beim Laden der Rechnungen.', 'Fehler');
        console.error(error);
      },
    });
  }

  openCreateDialog(): void {
    this.dialogService
        .open(InvoiceDialogComponent, {
          context: {
            title: 'Rechnung erstellen',
          },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
          dialogClass: 'fixed-dialog-width',
        })
        .onClose.subscribe((result: Invoice | undefined) => {
      if (result) {
        this.invoiceService.createInvoice(result).subscribe(() => {
          this.loadInvoices();
          this.toastrService.success('Rechnung erfolgreich erstellt.', 'Erfolg');
        })
      }
    });
  }

  openEditDialog(invoice: Invoice): void {
    if (invoice.status === Status.SENT || invoice.status === Status.PAID) {
      this.toastrService.warning('Versendete oder bezahlte Rechnungen können nicht bearbeitet werden.', 'Warnung');
      return;
    }

    this.dialogService
        .open(InvoiceDialogComponent, {
          context: {
            title: 'Rechnung bearbeiten',
            invoice: { ...invoice },
          },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
          dialogClass: 'fixed-dialog-width',
        })
        .onClose.subscribe((result: Invoice | undefined) => {
      if (result) {
        this.loadInvoices();
        this.toastrService.success('Rechnung erfolgreich aktualisiert.', 'Erfolg');
      }
    });
  }

  confirmDelete(invoice: Invoice): void {
    this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            title: 'Löschen bestätigen',
            message: `Möchten Sie Rechnung #${invoice.invoiceNumber} wirklich löschen?`,
          },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
        })
        .onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.invoiceService.deleteInvoice(invoice.id!).subscribe({
          next: () => {
            this.loadInvoices();
            this.toastrService.success('Rechnung erfolgreich gelöscht.', 'Erfolg');
          },
          error: (error) => {
            this.toastrService.danger('Fehler beim Löschen der Rechnung.', 'Fehler');
            console.error(error);
          },
        });
      }
    });
  }

  sendInvoice(invoice: Invoice): void {
    this.invoiceService.sendInvoice(invoice.id!).subscribe({
      next: () => {
        this.loadInvoices();
        this.toastrService.success('Rechnung erfolgreich versendet.', 'Erfolg');
      },
      error: (error) => {
        this.toastrService.danger('Fehler beim Versenden der Rechnung.', 'Fehler');
        console.error(error);
      },
    });
  }

  downloadPdf(invoice: Invoice): void {
    this.invoiceService.downloadInvoicePdf(invoice.id!).subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          this.toastrService.danger('Fehler beim Herunterladen der PDF.', 'Fehler');
          console.error(error);
        }
    );
  }

  getStatusBadge(status: Status): string {
    switch (status) {
      case Status.SENT:
        return 'Gesendet';
      case Status.PAID:
        return 'Bezahlt';
      case Status.DRAFT:
      default:
        return 'Entwurf';
    }
  }
}