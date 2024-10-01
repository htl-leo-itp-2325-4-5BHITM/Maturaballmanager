// src/app/components/invoice-dialog/invoice-dialog.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbIconModule,
    NbFormFieldModule,
    NbCardModule,
    NbCheckboxModule,
    NbToastrService,
    NbDatepickerModule
} from '@nebular/theme';
import { NbMomentDateModule } from '@nebular/moment';
import { CompanyService } from '../../../services/company.service';
import { BenefitService } from '../../../services/benefit.service';
import { InvoiceService } from '../../../services/invoice.service';
import { Company } from '../../../model/companies';
import { ContactPerson } from '../../../model/contactperson';
import { Benefit } from '../../../model/benefit';
import { Invoice, Status } from '../../../model/invoice';
import { NbDialogRef } from '@nebular/theme';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-invoice-dialog',
    templateUrl: './invoice-dialog.component.html',
    styleUrls: ['./invoice-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbButtonModule,
        NbInputModule,
        NbSelectModule,
        NbIconModule,
        NbFormFieldModule,
        NbCardModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbMomentDateModule
    ],
})
export class InvoiceDialogComponent implements OnInit {
    @Input() title: string = '';
    @Input() invoice: Invoice | null = null;

    form: FormGroup;

    companies: Company[] = [];
    contactPersons: ContactPerson[] = [];
    benefits: Benefit[] = [];

    constructor(
        private fb: FormBuilder,
        private companyService: CompanyService,
        private benefitService: BenefitService,
        private invoiceService: InvoiceService,
        private toastrService: NbToastrService,
        protected dialogRef: NbDialogRef<InvoiceDialogComponent>
    ) {
        this.form = this.fb.group({
            company: [null, Validators.required],
            contactPerson: [null],
            benefits: [[], Validators.required],
            invoiceDate: [null, Validators.required],
            paymentDeadline: [null, Validators.required],
            sendInvoice: [false],
        });
    }

    ngOnInit(): void {
        this.loadCompanies();
        this.loadBenefits();

        if (this.invoice) {
            this.form.patchValue({
                company: this.invoice.company?.id,
                contactPerson: this.invoice.contactPerson?.id || null,
                benefits: this.invoice.benefits.map(b => b.id),
                invoiceDate: this.invoice.invoiceDate ? new Date(this.invoice.invoiceDate) : null,
                paymentDeadline: this.invoice.paymentDeadline ? new Date(this.invoice.paymentDeadline) : null,
                sendInvoice: this.invoice.status === Status.SENT,
            });
            this.loadContactPersons(this.invoice.company?.id!);
        }

        // Listen for company changes to load corresponding contact persons
        this.form.get('company')?.valueChanges.subscribe(companyId => {
            this.loadContactPersons(companyId);
        });

        // Automatically set payment deadline based on invoice date (optional)
        this.form.get('invoiceDate')?.valueChanges.subscribe((date: Date) => {
            if (date && !this.form.get('paymentDeadline')?.value) {
                const deadline = new Date(date);
                deadline.setDate(deadline.getDate() + 14); // 14 Tage Frist
                this.form.get('paymentDeadline')?.setValue(deadline);
            }
        });
    }

    /**
     * Lädt alle Firmen vom Backend.
     */
    loadCompanies(): void {
        this.companyService.getCompanies().pipe(
            catchError(error => {
                console.error('Fehler beim Laden der Firmen', error);
                this.toastrService.danger('Fehler beim Laden der Firmen.', 'Fehler');
                return of([]);
            })
        ).subscribe(companies => {
            this.companies = companies;
        });
    }

    /**
     * Lädt alle Benefits vom Backend.
     */
    loadBenefits(): void {
        this.benefitService.getBenefits().pipe(
            catchError(error => {
                console.error('Fehler beim Laden der Benefits', error);
                this.toastrService.danger('Fehler beim Laden der Benefits.', 'Fehler');
                return of([]);
            })
        ).subscribe(benefits => {
            this.benefits = benefits;
        });
    }

    /**
     * Lädt Kontaktpersonen basierend auf der ausgewählten Firma.
     * @param companyId Firmen-ID
     */
    loadContactPersons(companyId: string): void {
        if (!companyId) {
            this.contactPersons = [];
            return;
        }

        this.companyService.getContactPersonsByCompany(companyId).pipe(
            catchError(error => {
                console.error('Fehler beim Laden der Kontaktpersonen', error);
                this.toastrService.danger('Fehler beim Laden der Kontaktpersonen.', 'Fehler');
                return of([]);
            })
        ).subscribe(contactPersons => {
            this.contactPersons = contactPersons.map(cp => ({
                ...cp,
                fullName: `${cp.firstName} ${cp.lastName}`
            }));
        });
    }

    /**
     * Übergibt die Formulardaten.
     */
    submit(): void {
        if (this.form.valid) {
            const formValue = this.form.value;

            const selectedCompany = this.companies.find(c => c.id === formValue.company);
            const selectedContactPerson = this.contactPersons.find(cp => cp.id === formValue.contactPerson) || null;
            const selectedBenefits = this.benefits.filter(b => formValue.benefits.includes(b.id));

            const invoice: Invoice = {
                id: this.invoice?.id || undefined,
                company: selectedCompany!,
                contactPerson: selectedContactPerson,
                benefits: selectedBenefits,
                invoiceDate: formValue.invoiceDate,
                paymentDeadline: formValue.paymentDeadline,
                status: formValue.sendInvoice ? Status.SENT : Status.DRAFT,
                totalAmount: selectedBenefits.reduce((sum, b) => sum + (b.price || 0), 0)
            };

            if (this.invoice) {
                // Bearbeiten einer bestehenden Rechnung
                this.invoiceService.updateInvoice(invoice.id!, invoice).subscribe({
                    next: (updatedInvoice) => {
                        this.toastrService.success('Rechnung erfolgreich aktualisiert.', 'Erfolg');
                        this.dialogRef.close(updatedInvoice);
                    },
                    error: (error) => {
                        console.error('Fehler beim Aktualisieren der Rechnung', error);
                        this.toastrService.danger('Fehler beim Aktualisieren der Rechnung.', 'Fehler');
                    }
                });
            } else {
                // Erstellen einer neuen Rechnung
                this.invoiceService.createInvoice(invoice).subscribe({
                    next: (newInvoice) => {
                        if (invoice.status === Status.SENT) {
                            this.invoiceService.sendInvoice(newInvoice.id!).subscribe({
                                next: () => {
                                    this.toastrService.success('Rechnung erfolgreich erstellt und versendet.', 'Erfolg');
                                    this.dialogRef.close(newInvoice);
                                },
                                error: (error) => {
                                    console.error('Fehler beim Versenden der Rechnung', error);
                                    this.toastrService.danger('Fehler beim Versenden der Rechnung.', 'Fehler');
                                }
                            });
                        } else {
                            this.toastrService.success('Rechnung erfolgreich erstellt.', 'Erfolg');
                            this.dialogRef.close(newInvoice);
                        }
                    },
                    error: (error) => {
                        console.error('Fehler beim Erstellen der Rechnung', error);
                        this.toastrService.danger('Fehler beim Erstellen der Rechnung.', 'Fehler');
                    }
                });
            }
        }
    }

    /**
     * Schließt den Dialog ohne Speichern.
     */
    cancel(): void {
        this.dialogRef.close();
    }
}