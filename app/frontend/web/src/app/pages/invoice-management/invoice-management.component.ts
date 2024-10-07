// src/app/components/invoice-management/invoice-management.component.ts

import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { NbButtonModule, NbCardModule, NbDialogService, NbFormFieldModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbToastrService, NbTooltipModule, NbTagModule } from '@nebular/theme';
import { saveAs } from 'file-saver';
import { NgxPaginationModule } from 'ngx-pagination';
import { Invoice, Status } from "../../model/invoice";
import { ConfirmDialogComponent } from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import { InvoiceDialogComponent } from "../../components/dialogs/invoice-dialog/invoice-dialog.component";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";

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
  ]
})
export class InvoiceManagementComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  sortColumn: keyof Invoice = 'invoiceDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  statuses = [Status.DRAFT, Status.SENT, Status.PAID];

  constructor(
      private invoiceService: InvoiceService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  /**
   * Lädt alle Rechnungen vom Backend.
   */
  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.applyFilters();
      },
      error: (error) => {
        this.toastrService.danger('Fehler beim Laden der Rechnungen.', 'Fehler');
        console.error(error);
      }
    });
  }

  /**
   * Wendet Such- und Sortierfilter an.
   */
  applyFilters(): void {
    let filtered = [...this.invoices];

    // Suchfilter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
          invoice.id?.toLowerCase().includes(term) ||
          invoice.company.name.toLowerCase().includes(term) ||
          (invoice.contactPerson?.firstName.toLowerCase().includes(term) || false) ||
          (invoice.contactPerson?.lastName.toLowerCase().includes(term) || false) ||
          invoice.status.toLowerCase().includes(term)
      );
    }

    // Sortierung
    filtered.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Umgang mit undefinierten oder null-Werten
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredInvoices = filtered;
    this.currentPage = 1; // Zurücksetzen der Pagination nach Filterung
  }

  /**
   * Handhabt die Sucheingabe.
   * @param event Eingabeereignis
   */
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  /**
   * Handhabt das Sortieren, wenn auf eine Spaltenüberschrift geklickt wird.
   * @param column Spaltenname
   */
  onSort(column: keyof Invoice): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  openCreateDialog(): void {
    this.dialogService.open(InvoiceDialogComponent, {
      context: {
        title: 'Rechnung erstellen'
      },
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: true,
      hasScroll: false,
      dialogClass: 'fixed-dialog-width' // Hinzugefügt
    }).onClose.subscribe((result: Invoice | undefined) => {
      if (result) {
        this.loadInvoices(); // Lade die Rechnungen neu, um die neue Rechnung anzuzeigen
        this.toastrService.success('Rechnung erfolgreich erstellt.', 'Erfolg');
      }
    });
  }

  openEditDialog(invoice: Invoice): void {
    if (invoice.status === Status.SENT || invoice.status === Status.PAID) { // Aktualisiert um PAID
      this.toastrService.warning('Versendete oder bezahlte Rechnungen können nicht bearbeitet werden.', 'Warnung');
      return;
    }

    this.dialogService.open(InvoiceDialogComponent, {
      context: {
        title: 'Rechnung bearbeiten',
        invoice: { ...invoice } // Übergibt eine Kopie der Rechnung
      },
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: true,
      hasScroll: false,
      dialogClass: 'fixed-dialog-width' // Hinzugefügt
    }).onClose.subscribe((result: Invoice | undefined) => {
      if (result) {
        this.loadInvoices(); // Lade die Rechnungen neu, um die aktualisierte Rechnung anzuzeigen
        this.toastrService.success('Rechnung erfolgreich aktualisiert.', 'Erfolg');
      }
    });
  }

  /**
   * Öffnet einen Bestätigungsdialog zum Löschen einer Rechnung.
   * @param invoice Rechnung zum Löschen
   */
  confirmDelete(invoice: Invoice): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Löschen bestätigen',
        message: `Möchten Sie Rechnung #${invoice.id} wirklich löschen?`
      },
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: true,
      hasScroll: false,
    }).onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.invoiceService.deleteInvoice(invoice.id!).subscribe({
          next: () => {
            this.loadInvoices(); // Lade die Rechnungen neu, um die gelöschte Rechnung zu entfernen
            this.toastrService.success('Rechnung erfolgreich gelöscht.', 'Erfolg');
          },
          error: (error) => {
            this.toastrService.danger('Fehler beim Löschen der Rechnung.', 'Fehler');
            console.error(error);
          }
        });
      }
    });
  }

  /**
   * Sendet eine Rechnung per E-Mail.
   * @param invoice Rechnung zum Versenden
   */
  sendInvoice(invoice: Invoice): void {
    this.invoiceService.sendInvoice(invoice.id!).subscribe({
      next: () => {
        this.loadInvoices(); // Lade die Rechnungen neu, um den aktualisierten Status anzuzeigen
        this.toastrService.success('Rechnung erfolgreich versendet.', 'Erfolg');
      },
      error: (error) => {
        this.toastrService.danger('Fehler beim Versenden der Rechnung.', 'Fehler');
        console.error(error);
      }
    });
  }

  /**
   * Lädt das PDF einer Rechnung herunter.
   * @param invoice Rechnung zum Herunterladen
   */
  downloadPdf(invoice: Invoice): void {
    this.invoiceService.downloadInvoicePdf(invoice.id!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading the PDF', error);
    });
  }

  download(id: string) {

  }

  /**
   * Gibt den passenden Tag-Status für die Anzeige zurück.
   * @param status Rechnungsstatus
   */
  getStatusTag(status: string): string {
    switch (status) {
      case 'SENT':
        return 'info';
      case 'PAID':
        return 'success';
      case 'DRAFT':
      default:
        return 'warning';
    }
  }

  /**
   * Handhabt die Änderung der Anzahl der Elemente pro Seite.
   * @param event Auswahlereignis
   */
  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = event;
    this.applyFilters();
  }

  protected readonly Status = Status;
}