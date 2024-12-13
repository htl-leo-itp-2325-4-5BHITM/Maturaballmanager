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
import {ReportComponent} from "../../components/report/report.component";

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
        ReportComponent,
    ],
})
export class CompanyManagementComponent implements OnInit {
    companies: Company[] = [];

    columns = [
        { key: 'name', title: 'Firmenname', sortable: true },
        { key: 'industry', title: 'Branche', sortable: true },
        {
            key: 'website',
            title: 'Website',
            format: (value: any) =>
                value ? `<a href="${value}" target="_blank">${value}</a>` : '—',
        },
    ];

    edit =  {
        icon: 'edit-outline',
        tooltip: 'Unternehmen bearbeiten',
        status: 'info',
        callback: this.openEditDialog.bind(this)
    };

    actions = [

        {
            icon: 'trash-2-outline',
            tooltip: 'Unternehmen löschen',
            status: 'danger',
            callback: this.confirmDelete.bind(this),
        },
    ];

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
            },
            error: (err: Error) => {
                this.toastrService.danger('Fehler beim Laden der Unternehmen', 'Fehler');
                console.error(err);
            },
        });
    }

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
                this.companyService.addCompany(result).subscribe(() => {
                    this.loadCompanies();
                    this.toastrService.success('Unternehmen erfolgreich erstellt.', 'Erfolg');
                })
            }
        });
    }

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
                this.companyService.updateCompany(result).subscribe(() => {
                    this.loadCompanies()
                    this.toastrService.success('Unternehmen erfolgreich aktualisiert.', 'Erfolg');
                })
            }
        });
    }

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
                        this.loadCompanies();
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
                this.loadCompanies();
                this.toastrService.success('Kontaktperson erfolgreich hinzugefügt.', 'Erfolg');
            }
        });
    }

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
                this.loadCompanies();
                this.toastrService.success('Kontaktperson erfolgreich aktualisiert.', 'Erfolg');
            }
        });
    }

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
                        this.loadCompanies();
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
}