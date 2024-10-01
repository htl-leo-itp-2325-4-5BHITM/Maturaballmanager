// src/app/components/company-list/company-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { NbButtonModule, NbCardModule, NbDialogModule, NbDialogService, NbToastrModule, NbToastrService } from '@nebular/theme';
import * as Papa from 'papaparse';
import { Company } from "../../model/companies";
import { CurrencyPipe, NgForOf, NgIf } from "@angular/common";
import { ConfirmDialogComponent } from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import { CompanyDialogComponent } from "../../components/dialogs/company-dialog/company-dialog.component";

@Component({
    selector: 'app-company-management',
    templateUrl: './company-management.component.html',
    standalone: true,
    imports: [
        NgForOf,
        NbCardModule,
        NbButtonModule,
        CurrencyPipe,
        NgIf,
        NbDialogModule, // Import NbDialogModule for NbDialogService
        NbToastrModule // Import NbToastrModule for NbToastrService
    ],
    providers: [],
    styleUrls: ['./company-management.component.scss']
})
export class CompanyManagementComponent implements OnInit {
    companies: Company[] = [];
    selectedCompanies: Set<string> = new Set();
    displayedColumns = [
        'select',
        'name',
        'industry',
        'website',
        'contactPerson',
        'invoiceCount',
        'totalRevenue',
        'actions'
    ];

    // Für erweiterte Details
    detailsVisible: Set<string> = new Set();

    constructor(
        private companyService: CompanyService,
        private dialogService: NbDialogService,
        private toastrService: NbToastrService
    ) {}

    ngOnInit(): void {
        this.companyService.getCompanies().subscribe(companies => {
            this.companies = companies;
        });
    }

    openCreateDialog(): void {
        this.dialogService.open(CompanyDialogComponent, {
            context: {
                title: 'Unternehmen erstellen'
            }
        }).onClose.subscribe((result: Company) => {
            console.log("hallo")
            if (result) {
                this.companyService.addCompany(result).subscribe(company => {
                    this.companies.push(company);
                });
                this.toastrService.success('Unternehmen erstellt', 'Erfolg');
            }
        });
    }

    openEditDialog(company: Company): void {
        this.dialogService.open(CompanyDialogComponent, {
            context: {
                title: 'Unternehmen bearbeiten',
                company: { ...company }
            }
        }).onClose.subscribe((result: Company) => {
            if (result) {
                this.companyService.updateCompany(result).subscribe(() => {
                    const index = this.companies.findIndex(c => c.id === result.id);
                    this.companies[index] = result;
                })
                this.toastrService.success('Unternehmen aktualisiert', 'Erfolg');
            }
        });
    }

    confirmDelete(company: Company): void {
        this.dialogService.open(ConfirmDialogComponent, {
            context: {
                title: 'Löschen bestätigen',
                message: `Möchtest du das Unternehmen "${company.name}" wirklich löschen?`
            }
        }).onClose.subscribe(confirmed => {
            if (confirmed) {
                this.companyService.deleteCompany(company.id!).subscribe(() => {
                    this.companies = this.companies.filter(c => c.id !== company.id);
                })
                this.toastrService.success('Unternehmen gelöscht', 'Erfolg');
            }
        });
    }

    toggleSelection(id: string, event: any): void {
        if (event.target.checked) {
            this.selectedCompanies.add(id);
        } else {
            this.selectedCompanies.delete(id);
        }
    }

    bulkDelete(): void {
        if (this.selectedCompanies.size === 0) {
            this.toastrService.warning('Keine Unternehmen ausgewählt', 'Warnung');
            return;
        }

        this.dialogService.open(ConfirmDialogComponent, {
            context: {
                title: 'Bulk-Löschen bestätigen',
                message: `Möchtest du die ausgewählten ${this.selectedCompanies.size} Unternehmen wirklich löschen?`
            }
        }).onClose.subscribe(confirmed => {
            if (confirmed) {
                this.companyService.deleteCompanies(Array.from(this.selectedCompanies));
                this.selectedCompanies.clear();
                this.toastrService.success('Ausgewählte Unternehmen gelöscht', 'Erfolg');
            }
        });
    }

    exportCSV(): void {
        const data = this.companies.map(company => ({
            Firmenname: company.name,
            Branche: company.industry,
            Website: company.website,
            'Name der Kontaktperson': company.contactPersons && company.contactPersons.length > 0
                ? `${company.contactPersons[0].firstName} ${company.contactPersons[0].lastName}`
                : 'Nicht festgelegt',
            'Anzahl Rechnungen': company.invoiceCount,
            'Gesamtumsatz': company.totalRevenue
        }));

        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'companies.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Methoden für erweiterte Details
    toggleDetails(id: string): void {
        if (this.detailsVisible.has(id)) {
            this.detailsVisible.delete(id);
        } else {
            this.detailsVisible.add(id);
        }
    }

    isDetailsVisible(id: string): boolean {
        return this.detailsVisible.has(id);
    }

    toggleSelectAll(event: any): void {
        if (event.target.checked) {
            this.companies.forEach(c => this.selectedCompanies.add(c.id!));
        } else {
            this.selectedCompanies.clear();
        }
    }
}
