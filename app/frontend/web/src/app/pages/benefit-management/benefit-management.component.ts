// src/app/components/benefit-management/benefit-management.component.ts
import {Component, OnInit} from '@angular/core';
import {BenefitService} from '../../services/benefit.service';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbIconModule, NbInputModule,
  NbSelectModule,
  NbToastrService
} from '@nebular/theme';
import {Benefit} from '../../model/benefit';
import {NgxPaginationModule} from 'ngx-pagination';
import {BenefitDialogComponent} from "../../components/dialogs/benefit-dialog/benefit-dialog.component";
import {ConfirmDialogComponent} from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-benefit-management',
  templateUrl: './benefit-management.component.html',
  styleUrls: ['./benefit-management.component.scss'],
  standalone: true,
  imports: [
    NgxPaginationModule,
    NbSelectModule,
    NbIconModule,
    NbButtonModule,
    CurrencyPipe,
    NgForOf,
    NgIf,
    NbCardModule,
    NbInputModule,
    // ... andere Imports
  ]
})
export class BenefitManagementComponent implements OnInit {
  benefits: Benefit[] = [];
  filteredBenefits: Benefit[] = [];
  p: number = 1; // Aktuelle Seite
  itemsPerPage: number = 10; // Einträge pro Seite
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
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.benefits];

    // Suchfilter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
          b.name?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term)
      );
    }

    // Sortierung
    filtered.sort((a, b) => {
      const valueA = a[this.sortColumn] || '';
      const valueB = b[this.sortColumn] || '';
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return this.sortDirection === 'asc'
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
      }
    });

    this.filteredBenefits = filtered;
  }

  onPageChange(page: number): void {
    this.p = page;
  }

  onItemsPerPageChange(count: number): void {
    this.itemsPerPage = count;
    this.p = 1; // Zurück zur ersten Seite
  }

  onSort(column: keyof Benefit): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onSearch(event: EventTarget | null): void {
    this.searchTerm = (event as HTMLInputElement)?.value || '';
    this.p = 1;
    this.applyFilters();
  }

  openCreateDialog(): void {
    this.dialogService.open(BenefitDialogComponent, {
      context: {
        title: 'Gegenleistung erstellen'
      }
    }).onClose.subscribe((result: Benefit) => {
      if (result) {
        this.benefitService.addBenefit(result).subscribe({
          next: (newBenefit) => {
            this.benefits.push(newBenefit);
            this.applyFilters();
            this.toastrService.success('Gegenleistung erstellt', 'Erfolg');
          },
          error: (err) => {
            this.toastrService.danger('Fehler beim Erstellen der Gegenleistung', 'Fehler');
            console.error(err);
          }
        });
      }
    });
  }

  openEditDialog(benefit: Benefit): void {
    this.dialogService.open(BenefitDialogComponent, {
      context: {
        title: 'Gegenleistung bearbeiten',
        benefit: { ...benefit }
      }
    }).onClose.subscribe((result: Benefit) => {
      if (result) {
        this.benefitService.updateBenefit(result).subscribe({
          next: (updatedBenefit) => {
            const index = this.benefits.findIndex(b => b.id === updatedBenefit.id);
            if (index !== -1) {
              this.benefits[index] = updatedBenefit;
              this.applyFilters();
              this.toastrService.success('Gegenleistung aktualisiert', 'Erfolg');
            }
          },
          error: (err) => {
            this.toastrService.danger('Fehler beim Aktualisieren der Gegenleistung', 'Fehler');
            console.error(err);
          }
        });
      }
    });
  }

  confirmDelete(benefit: Benefit): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Löschen bestätigen',
        message: `Möchtest du die Gegenleistung "${benefit.name}" wirklich löschen?`
      }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.benefitService.deleteBenefit(benefit.id!).subscribe({
          next: () => {
            this.benefits = this.benefits.filter(b => b.id !== benefit.id);
            this.applyFilters();
            this.toastrService.success('Gegenleistung gelöscht', 'Erfolg');
          },
          error: (err) => {
            this.toastrService.danger('Fehler beim Löschen der Gegenleistung', 'Fehler');
            console.error(err);
          }
        });
      }
    });
  }
}