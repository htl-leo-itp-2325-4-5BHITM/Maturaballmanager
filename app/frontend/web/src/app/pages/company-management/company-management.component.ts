import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogService,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbToastrService, NbTooltipModule,
} from '@nebular/theme';
import { Company } from '../../model/companies';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompanyDialogComponent } from '../../components/dialogs/company-dialog/company-dialog.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ContactPerson} from "../../model/contactperson";
import {
    ContactPersonDialogComponent
} from "../../components/dialogs/contact-person-dialog/contact-person-dialog.component";

@Component({
    selector: 'app-company-management',
    templateUrl: './company-management.component.html',
    styleUrls: ['./company-management.component.scss'],
    standalone: true,
    imports: [
        NgxPaginationModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        NgForOf,
        NgIf,
        NbCardModule,
        NbInputModule,
        NbTooltipModule,
        NgClass,
    ],
})
export class CompanyManagementComponent implements OnInit {
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    p: number = 1; // Current page
    itemsPerPage: number = 10; // Items per page
    sortColumn: keyof Company = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';
    searchTerm: string = '';
    detailsVisible: Set<string> = new Set(); // To track visible details

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

    applyFilters(): void {
        let filtered = [...this.companies];
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(company =>
                company.name.toLowerCase().includes(term) ||
                company.industry.toLowerCase().includes(term)
            );
        }
        filtered.sort((a, b) => {
            const valueA = a[this.sortColumn] || '';
            const valueB = b[this.sortColumn] || '';
            return this.sortDirection === 'asc'
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });
        this.filteredCompanies = filtered;
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

    onPageChange(page: number): void {
        this.p = page;
    }

    onItemsPerPageChange(count: number): void {
        this.itemsPerPage = count;
        this.p = 1; // Reset to first page
    }

    onSort(column: keyof Company): void {
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
        this.dialogService.open(CompanyDialogComponent, {
            context: {
                title: 'Unternehmen erstellen',
            },
        }).onClose.subscribe((result: Company) => {
            if (result) {
                this.companyService.addCompany(result).subscribe({
                    next: (newCompany: Company) => {
                        this.companies.push(newCompany);
                        this.applyFilters();
                        this.toastrService.success('Unternehmen erstellt', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Erstellen des Unternehmens', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }

    openEditDialog(company: Company): void {
        this.dialogService.open(CompanyDialogComponent, {
            context: {
                title: 'Unternehmen bearbeiten',
                company: { ...company },
            },
        }).onClose.subscribe((result: Company) => {
            if (result) {
                this.companyService.updateCompany(result).subscribe({
                    next: (updatedCompany: Company) => {
                        const index = this.companies.findIndex((c) => c.id === updatedCompany.id);
                        if (index !== -1) {
                            this.companies[index] = updatedCompany;
                            this.applyFilters();
                            this.toastrService.success('Unternehmen aktualisiert', 'Erfolg');
                        }
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Aktualisieren des Unternehmens', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }

    confirmDelete(company: Company): void {
        this.dialogService.open(ConfirmDialogComponent, {
            context: {
                title: 'Löschen bestätigen',
                message: `Möchtest du das Unternehmen "${company.name}" wirklich löschen?`,
            },
        }).onClose.subscribe((confirmed) => {
            if (confirmed) {
                this.companyService.deleteCompany(company.id!).subscribe({
                    next: () => {
                        this.companies = this.companies.filter((c) => c.id !== company.id);
                        this.applyFilters();
                        this.toastrService.success('Unternehmen gelöscht', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Löschen des Unternehmens', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }

    openAddContactPersonDialog(company: Company): void {
        this.dialogService.open(ContactPersonDialogComponent, {
            context: {
                title: 'Kontaktperson hinzufügen',
                company: company,
            },
        }).onClose.subscribe((result: ContactPerson) => {
            if (result) {
                this.companyService.addContactPerson(result, company.id!).subscribe({
                    next: (newContactPerson: ContactPerson) => {
                        // Update the company's contact persons list
                        company.contactPersons!.push(newContactPerson);
                        this.toastrService.success('Kontaktperson hinzugefügt', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Hinzufügen der Kontaktperson', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }

    openEditContactPersonDialog(company: Company, contactPerson: ContactPerson): void {
        this.dialogService.open(ContactPersonDialogComponent, {
            context: {
                title: 'Kontaktperson bearbeiten',
                company: company,
                contactPerson: { ...contactPerson
            },
        }}).onClose.subscribe((result: ContactPerson) => {
            if (result) {
                this.companyService.updateContactPerson(result, company.id!).subscribe({
                    next: (updatedContactPerson: ContactPerson) => {
                        const index = company.contactPersons!.findIndex(cp => cp.id === updatedContactPerson.id);
                        if (index !== -1) {
                            company.contactPersons![index] = updatedContactPerson;
                        }
                        this.toastrService.success('Kontaktperson aktualisiert', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Aktualisieren der Kontaktperson', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }

    confirmDeleteContactPerson(company: Company, contactPerson: ContactPerson): void {
        this.dialogService.open(ConfirmDialogComponent, {
            context: {
                title: 'Löschen bestätigen',
                message: `Möchtest du die Kontaktperson "${contactPerson.firstName} ${contactPerson.lastName}" wirklich löschen?`,
            },
        }).onClose.subscribe((confirmed) => {
            if (confirmed) {
                this.companyService.deleteContactPerson(contactPerson.id!).subscribe({
                    next: () => {
                        company.contactPersons = company.contactPersons!.filter(cp => cp.id !== contactPerson.id);
                        this.toastrService.success('Kontaktperson gelöscht', 'Erfolg');
                    },
                    error: (err: Error) => {
                        this.toastrService.danger('Fehler beim Löschen der Kontaktperson', 'Fehler');
                        console.error(err);
                    },
                });
            }
        });
    }
}