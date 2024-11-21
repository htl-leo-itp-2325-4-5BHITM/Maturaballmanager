import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
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
import { Company } from '../../model/companies';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompanyDialogComponent } from '../../components/dialogs/company-dialog/company-dialog.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { NgForOf, NgIf } from '@angular/common';
import { ContactPerson } from '../../model/contactperson';
import { ContactPersonDialogComponent } from '../../components/dialogs/contact-person-dialog/contact-person-dialog.component';

@Component({
    selector: 'app-company-management',
    templateUrl: './company-management.component.html',
    styleUrls: ['./company-management.component.scss'],
    standalone: true,
    imports: [
        NgxPaginationModule,
        NbOptionModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        NbTooltipModule,
        NgForOf,
        NgIf,
        NbFormFieldModule,
        NbCardModule,
        NbInputModule,
        CompanyDialogComponent,
        ConfirmDialogComponent,
        ContactPersonDialogComponent,
    ],
})
export class CompanyManagementComponent implements OnInit {
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    sortColumn: keyof Company = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';
    searchTerm: string = '';
    detailsVisible: Set<string> = new Set(); // Um sichtbare Details zu verfolgen

    constructor(
        private companyService: CompanyService,
        private dialogService: NbDialogService,
        private toastrService: NbToastrService
    ) {}

    ngOnInit(): void {
        this.loadCompanies();
    }

    loadCompanies(): void {
        this.companyService.getCompanies().subscribe({
            next: (companies: Company[]) => {
                this.companies = companies;
                this.applyFilters();
            },
            error: (err: Error) => {
                this.toastrService.danger('Fehler beim Laden der Unternehmen', 'Fehler');
                console.error(err);
            },
        });
    }

    /**
     * Wendet Such- und Sortierfilter an.
     */
    applyFilters(): void {
        let filtered = [...this.companies];
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (company) =>
                    company.name.toLowerCase().includes(term) ||
                    company.industry.toLowerCase().includes(term)
            );
        }
        filtered.sort((a, b) => {
            let valA = a[this.sortColumn] || '';
            let valB = b[this.sortColumn] || '';

            if (valA === undefined || valA === null) valA = '';
            if (valB === undefined || valB === null) valB = '';

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        this.filteredCompanies = filtered;
        this.currentPage = 1; // Zurücksetzen der Pagination nach Filterung
    }

    toggleDetails(companyId: string): void {
        if (this.detailsVisible.has(companyId)) {
            this.detailsVisible.delete(companyId);
        } else {
            this.detailsVisible.add(companyId);
        }
    }

    isDetailsVisible(companyId: string): boolean {
        return this.detailsVisible.has(companyId);
    }

    /**
     * Handhabt die Sucheingabe.
     * @param event Eingabeereignis
     */
    onSearch(event: Event): void {
        this.searchTerm = (event.target as HTMLInputElement)?.value || '';
        this.applyFilters();
    }

    /**
     * Handhabt das Sortieren, wenn auf eine Spaltenüberschrift geklickt wird.
     * @param column Spaltenname
     */
    onSort(column: keyof Company): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.applyFilters();
    }

    /**
     * Öffnet den Dialog zum Erstellen eines neuen Unternehmens.
     */
    openCreateDialog(): void {
        this.dialogService
            .open(CompanyDialogComponent, {
                context: {
                    title: 'Unternehmen erstellen',
                },
                closeOnBackdropClick: false,
                closeOnEsc: false,
                autoFocus: true,
                hasScroll: false,
                dialogClass: 'fixed-dialog-width',
            })
            .onClose.subscribe((result: Company | undefined) => {
            if (result) {
                this.loadCompanies();
                this.toastrService.success('Unternehmen erfolgreich erstellt.', 'Erfolg');
            }
        });
    }

    /**
     * Öffnet den Dialog zum Bearbeiten eines Unternehmens.
     * @param company Unternehmen zum Bearbeiten
     */
    openEditDialog(company: Company): void {
        this.dialogService
            .open(CompanyDialogComponent, {
                context: {
                    title: 'Unternehmen bearbeiten',
                    company: { ...company },
                },
                closeOnBackdropClick: false,
                closeOnEsc: false,
                autoFocus: true,
                hasScroll: false,
                dialogClass: 'fixed-dialog-width',
            })
            .onClose.subscribe((result: Company | undefined) => {
            if (result) {
                this.loadCompanies(); // Lade die Unternehmen neu, um das aktualisierte Unternehmen anzuzeigen
                this.toastrService.success('Unternehmen erfolgreich aktualisiert.', 'Erfolg');
            }
        });
    }

    /**
     * Öffnet einen Bestätigungsdialog zum Löschen eines Unternehmens.
     * @param company Unternehmen zum Löschen
     */
    confirmDelete(company: Company): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    title: 'Löschen bestätigen',
                    message: `Möchten Sie das Unternehmen "${company.name}" wirklich löschen?`,
                },
                closeOnBackdropClick: false,
                closeOnEsc: false,
                autoFocus: true,
                hasScroll: false,
            })
            .onClose.subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.companyService.deleteCompany(company.id!).subscribe({
                    next: () => {
                        this.loadCompanies(); // Lade die Unternehmen neu, um das gelöschte Unternehmen zu entfernen
                        this.toastrService.success('Unternehmen erfolgreich gelöscht.', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Löschen des Unternehmens', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }

    /**
     * Öffnet den Dialog zum Hinzufügen einer Kontaktperson zu einem Unternehmen.
     * @param company Unternehmen, dem die Kontaktperson hinzugefügt wird
     */
    openAddContactPersonDialog(company: Company): void {
        this.dialogService
            .open(ContactPersonDialogComponent, {
                context: {
                    title: 'Kontaktperson hinzufügen',
                    company: company,
                },
                closeOnBackdropClick: false,
                closeOnEsc: false,
                autoFocus: true,
                hasScroll: false,
                dialogClass: 'fixed-dialog-width',
            })
            .onClose.subscribe((result: ContactPerson | undefined) => {
            if (result) {
                this.loadCompanies(); // Lade die Unternehmen neu, um die aktualisierten Daten anzuzeigen
                this.toastrService.success('Kontaktperson erfolgreich hinzugefügt.', 'Erfolg');
            }
        });
    }

    /**
     * Öffnet den Dialog zum Bearbeiten einer Kontaktperson.
     * @param company Unternehmen der Kontaktperson
     * @param contactPerson Kontaktperson zum Bearbeiten
     */
    openEditContactPersonDialog(company: Company, contactPerson: ContactPerson): void {
        this.dialogService
            .open(ContactPersonDialogComponent, {
                context: {
                    title: 'Kontaktperson bearbeiten',
                    company: company,
                    contactPerson: { ...contactPerson },
                },
                closeOnBackdropClick: false,
                closeOnEsc: false,
                autoFocus: true,
                hasScroll: false,
                dialogClass: 'fixed-dialog-width',
            })
            .onClose.subscribe((result: ContactPerson | undefined) => {
            if (result) {
                this.loadCompanies(); // Lade die Unternehmen neu, um die aktualisierten Daten anzuzeigen
                this.toastrService.success('Kontaktperson erfolgreich aktualisiert.', 'Erfolg');
            }
        });
    }

    /**
     * Öffnet einen Bestätigungsdialog zum Löschen einer Kontaktperson.
     * @param company Unternehmen der Kontaktperson
     * @param contactPerson Kontaktperson zum Löschen
     */
    confirmDeleteContactPerson(company: Company, contactPerson: ContactPerson): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    title: 'Löschen bestätigen',
                    message: `Möchten Sie die Kontaktperson "${contactPerson.firstName} ${contactPerson.lastName}" wirklich löschen?`,
                },
                closeOnBackdropClick: false,
                closeOnEsc: false,
                autoFocus: true,
                hasScroll: false,
            })
            .onClose.subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.companyService.deleteContactPerson(contactPerson.id!).subscribe({
                    next: () => {
                        this.loadCompanies(); // Lade die Unternehmen neu, um die gelöschte Kontaktperson zu entfernen
                        this.toastrService.success('Kontaktperson erfolgreich gelöscht.', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Löschen der Kontaktperson', 'Fehler');
                        console.error(err);
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