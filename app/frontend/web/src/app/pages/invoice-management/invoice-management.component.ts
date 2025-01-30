import {Component, OnInit} from '@angular/core';
import {InvoiceService} from '../../services/invoice.service';
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbSelectModule,
  NbTagModule,
  NbToastrService,
  NbTooltipModule
} from '@nebular/theme';
import {NgxPaginationModule} from 'ngx-pagination';
import {Invoice, Status} from "../../model/invoice";
import {ConfirmDialogComponent} from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import {InvoiceDialogComponent} from "../../components/dialogs/invoice-dialog/invoice-dialog.component";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {ReportComponent} from "../../components/report/report.component";
import {InvoiceDTO} from "../../model/dtos/invoice.dto";
import {SendInvoiceDialogComponent} from "../../components/dialogs/send-invoice-dialog/send-invoice-dialog.component";

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
    { key: 'id', title: 'ID', sortable: true },
    {
      key: 'companyName',
      title: 'Firma',
      sortable: true,
      format: (value: any) => value || '—',
    },
    {
      key: 'contactPersonName',
      title: 'Kontaktperson',
      format: (value: any) => value || '—',
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
      key: 'sendOption',
      title: 'Sendeoption',
      sortable: true,
      format: (value: any) => value === 'immediate' ? 'Direkt versenden' : 'Am Rechnungsdatum versenden',
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
      disabled: (row: Invoice) => row.status === Status.SENT || row.status === Status.PAID,
    },
    {
      icon: 'paper-plane-outline',
      tooltip: 'Rechnung versenden',
      status: 'info',
      callback: this.openSendInvoiceDialog.bind(this),
      disabled: (row: Invoice) => row.status === Status.SENT || row.status === Status.PAID,
    },
    {
      icon: 'checkmark-outline',
      tooltip: 'Als bezahlt markieren',
      status: 'success',
      callback: this.markAsPaid.bind(this),
      disabled: (row: Invoice) => row.status !== Status.SENT,
    },
    {
      icon: 'download-outline',
      tooltip: 'PDF herunterladen',
      status: 'primary',
      callback: this.downloadPdf.bind(this),
    },
  ];

  markAsPaid(invoice: Invoice): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Als bezahlt markieren?',
        message: `Möchten Sie Rechnung #${invoice.id} wirklich als bezahlt markieren?`,
      },
      closeOnBackdropClick: false,
      closeOnEsc: false,
    }).onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.invoiceService.markInvoiceAsPaid(invoice.id!).subscribe({
          next: (updatedInvoice) => {
            this.toastrService.success(`Rechnung #${updatedInvoice.id} bezahlt`, 'Erfolg');
            this.loadInvoices();
          },
          error: (err) => {
            this.toastrService.danger('Fehler beim Aktualisieren auf bezahlt.', 'Fehler');
            console.error(err);
          }
        });
      }
    });
  }


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
        .onClose.subscribe((result: InvoiceDTO | undefined) => {
      if (result) {
        this.invoiceService.createInvoice(result).subscribe({
          next: (createdInvoice) => {
            this.toastrService.success('Rechnung erfolgreich erstellt.', 'Erfolg');
            this.loadInvoices();

            if (result.sendOption === 'immediate') {
              this.invoiceService.sendInvoice(createdInvoice.id!, 'OFFICE').subscribe({
                next: () => {
                  this.toastrService.success('Rechnung sofort versendet.', 'Erfolg');
                  this.loadInvoices();
                },
                error: (err) => {
                  this.toastrService.danger('Fehler beim Sofortversand.', 'Fehler');
                  console.error(err);
                },
              });
            }
          },
          error: (error) => {
            this.toastrService.danger('Fehler beim Erstellen der Rechnung.', 'Fehler');
            console.error(error);
          },
        });
      }
    });
  }


  /**
   * Öffnet den Dialog zum Versenden der Rechnung per E-Mail.
   * @param invoice Die zu sendende Rechnung
   */
  openSendInvoiceDialog(invoice: Invoice): void {
    this.dialogService
        .open(SendInvoiceDialogComponent, {
          context: { invoice },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
          dialogClass: 'fixed-dialog-width',
        })
        .onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadInvoices();
      }
    });
  }

  openEditDialog(invoice: InvoiceDTO): void {
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
        .onClose.subscribe((result: InvoiceDTO | undefined) => {
      if (result) {
        this.invoiceService.updateInvoice(result.id!, result).subscribe((res) => {
          this.loadInvoices();
          this.toastrService.success('Rechnung erfolgreich aktualisiert.', 'Erfolg');
        })
      }
    });
  }

  confirmDelete(invoice: Invoice): void {
    this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            title: 'Löschen bestätigen',
            message: `Möchten Sie Rechnung #${invoice.id} wirklich löschen?`,
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

  downloadPdf(invoice: Invoice): void {
    this.invoiceService.generateInvoicePdf(invoice.id!).subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Kopie_Rechnung_${invoice.id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error: Error) => {
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
