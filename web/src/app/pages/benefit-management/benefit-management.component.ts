import { Component, OnInit } from '@angular/core';
import { BenefitService } from '../../services/benefit.service';
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
} from '@nebular/theme';
import { Benefit } from '../../model/benefit';
import { NgxPaginationModule } from 'ngx-pagination';
import { BenefitDialogComponent } from '../../components/dialogs/benefit-dialog/benefit-dialog.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-benefit-management',
  templateUrl: './benefit-management.component.html',
  styleUrls: ['./benefit-management.component.scss'],
  standalone: true,
  imports: [
    NgxPaginationModule,
    NbOptionModule,
    NbSelectModule,
    NbIconModule,
    NbButtonModule,
    NbTooltipModule,
    CurrencyPipe,
    NgForOf,
    NgIf,
    NbFormFieldModule,
    NbCardModule,
    NbInputModule,
    BenefitDialogComponent,
    ConfirmDialogComponent,
  ],
})
export class BenefitManagementComponent implements OnInit {
  benefits: Benefit[] = [];
  filteredBenefits: Benefit[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: keyof Benefit = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  constructor(
      private benefitService: BenefitService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loadBenefits();
  }

  loadBenefits(): void {
    this.benefitService.getBenefits().subscribe({
      next: (benefits) => {
        this.benefits = benefits;
        this.applyFilters();
      },
      error: (err) => {
        this.toastrService.danger('Fehler beim Laden der Gegenleistungen', 'Fehler');
        console.error(err);
      },
    });
  }

  /**
   * Wendet Such- und Sortierfilter an.
   */
  applyFilters(): void {
    let filtered = [...this.benefits];

    // Suchfilter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
          (b) =>
              b.name?.toLowerCase().includes(term) || b.description?.toLowerCase().includes(term)
      );
    }

    // Sortierung
    filtered.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredBenefits = filtered;
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
  onSort(column: keyof Benefit): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  /**
   * Öffnet den Dialog zum Erstellen einer neuen Gegenleistung.
   */
  openCreateDialog(): void {
    this.dialogService
        .open(BenefitDialogComponent, {
          context: {
            title: 'Gegenleistung erstellen',
          },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
          dialogClass: 'fixed-dialog-width',
        })
        .onClose.subscribe((result: Benefit | undefined) => {
      if (result) {
        // TODO : Create benefit in Backend
        this.loadBenefits();
        this.toastrService.success('Gegenleistung erfolgreich erstellt.', 'Erfolg');
      }
    });
  }

  /**
   * Öffnet den Dialog zum Bearbeiten einer Gegenleistung.
   * @param benefit Gegenleistung zum Bearbeiten
   */
  openEditDialog(benefit: Benefit): void {
    this.dialogService
        .open(BenefitDialogComponent, {
          context: {
            title: 'Gegenleistung bearbeiten',
            benefit: { ...benefit },
          },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
          dialogClass: 'fixed-dialog-width',
        })
        .onClose.subscribe((result: Benefit | undefined) => {
      if (result) {
        this.benefitService.updateBenefit(benefit)
        this.loadBenefits(); // Lade die Gegenleistungen neu, um die aktualisierte Gegenleistung anzuzeigen
        this.toastrService.success('Gegenleistung erfolgreich aktualisiert.', 'Erfolg');
      }
    });
  }

  /**
   * Öffnet einen Bestätigungsdialog zum Löschen einer Gegenleistung.
   * @param benefit Gegenleistung zum Löschen
   */
  confirmDelete(benefit: Benefit): void {
    this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            title: 'Löschen bestätigen',
            message: `Möchten Sie die Gegenleistung "${benefit.name}" wirklich löschen?`,
          },
          closeOnBackdropClick: false,
          closeOnEsc: false,
          autoFocus: true,
          hasScroll: false,
        })
        .onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.benefitService.deleteBenefit(benefit.id!).subscribe({
          next: () => {
            this.loadBenefits(); // Lade die Gegenleistungen neu, um die gelöschte Gegenleistung zu entfernen
            this.toastrService.success('Gegenleistung erfolgreich gelöscht.', 'Erfolg');
          },
          error: (error) => {
            this.toastrService.danger('Fehler beim Löschen der Gegenleistung.', 'Fehler');
            console.error(error);
          },
        });
      }
    });
  }

  /**
   * Handhabt die Änderung der Anzahl der Elemente pro Seite.
   * @param event Auswahlereignis
   */
  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = event;
    this.applyFilters();
  }
}
