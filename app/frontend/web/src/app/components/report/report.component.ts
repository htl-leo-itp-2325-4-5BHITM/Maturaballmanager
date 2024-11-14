import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgForOf, NgIf } from '@angular/common';

interface ColumnConfig {
  key: string;
  title: string;
  sortable?: boolean;
  format?: (value: any, row: any) => string;
}

interface ActionConfig {
  icon: string;
  tooltip: string;
  status: string;
  disabled?: (row: any) => boolean;
  callback: (row: any) => void;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: true,
  imports: [
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbOptionModule,
    NgxPaginationModule,
    NgForOf,
    NgIf,
  ],
})
export class ReportComponent implements OnInit {
  @Input() title: string = 'Report';
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() actions: ActionConfig[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() addButtonLabel: string = 'Hinzufügen';
  @Input() addButtonCallback: () => void = () => {};

  @Output() searchChange = new EventEmitter<string>();

  filteredData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  expandedRows: Set<any> = new Set();

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  /**
   * Wendet Such- und Sortierfilter an.
   */
  applyFilters(): void {
    let filtered = [...this.data];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
          this.columns.some((col) => {
            const value = row[col.key];
            return value && value.toString().toLowerCase().includes(term);
          })
      );
    }

    if (this.sortColumn) {
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
    }

    this.filteredData = filtered;
    this.currentPage = 1; // Zurücksetzen der Pagination nach Filterung
  }

  /**
   * Handhabt die Sucheingabe.
   * @param event Eingabeereignis
   */
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.searchChange.emit(this.searchTerm);
    this.applyFilters();
  }

  /**
   * Handhabt das Sortieren.
   * @param column Spaltenname
   */
  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  /**
   * Handhabt die Änderung der Anzahl der Elemente pro Seite.
   * @param event Auswahlereignis
   */
  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = event;
    this.applyFilters();
  }

  toggleDetails(row: any): void {
    if (this.expandedRows.has(row)) {
      this.expandedRows.delete(row);
    } else {
      this.expandedRows.add(row);
    }
  }
}