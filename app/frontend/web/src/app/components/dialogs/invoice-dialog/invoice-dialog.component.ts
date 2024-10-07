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
    NbDatepickerModule, NbRadioModule
} from '@nebular/theme';
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
import {provideNebular} from "../../../nebular.providers";

@Component({
    selector: 'app-invoice-dialog',
    templateUrl: './invoice-dialog.component.html',
    styleUrls: ['./invoice-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        NbSelectModule,
        NbIconModule,
        NbFormFieldModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbRadioModule,
    ],
    providers: [provideNebular()]
})
export class InvoiceDialogComponent implements OnInit {
    @Input() title: string = '';
    @Input() invoice: Invoice | null = null;

    form: FormGroup;

    // Neue Felder für die Send-Option
    sendOptions = [
        { value: 'immediate', label: 'Direkt versenden' },
        { value: 'onDate', label: 'Am Rechnungsdatum versenden' }
    ];

    // Neue Variable für Statusoptionen
    statusOptions: Status[] = [];

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
            invoiceDate: [new Date(), Validators.required],
            paymentDeadline: [{ value: null, disabled: true }, Validators.required],
            sendOption: ['immediate', Validators.required], // Neues Feld
            scheduledSendDate: [{ value: null, disabled: true }], // Datum für geplanten Versand
            status: [Status.DRAFT, Validators.required], // Neues Feld
            totalAmount: [{ value: 0, disabled: true }],
        });
    }

    ngOnInit(): void {
        this.loadCompanies();
        this.loadBenefits();

        // Initialisierung des Statusfeldes
        this.statusOptions = [Status.DRAFT, Status.SENT, Status.PAID];

        if (this.invoice) {
            this.form.patchValue({
                company: this.invoice.company?.id,
                contactPerson: this.invoice.contactPerson?.id || null,
                benefits: this.invoice.benefits.map(b => b.id),
                invoiceDate: this.invoice.invoiceDate ? new Date(this.invoice.invoiceDate) : new Date(),
                paymentDeadline: this.invoice.paymentDeadline ? new Date(this.invoice.paymentDeadline) : null,
                sendOption: this.invoice.status === Status.SENT ? 'immediate' : 'immediate', // Anpassung je nach Status
                status: this.invoice.status, // Status setzen
            });
            this.loadContactPersons(this.invoice.company?.id!);
        }

        this.form.get('company')?.valueChanges.subscribe(companyId => {
            this.loadContactPersons(companyId);
        });

        this.form.get('benefits')?.valueChanges.subscribe(selectedBenefitIds => {
            this.calculateTotalAmount(selectedBenefitIds);
        });

        this.form.get('invoiceDate')?.valueChanges.subscribe((date: Date) => {
            if (date) {
                const deadline = new Date(date);
                deadline.setDate(deadline.getDate() + 14); // 14 Tage Frist
                this.form.get('paymentDeadline')?.setValue(deadline);
            }
        });

        // Listen to sendOption changes
        this.form.get('sendOption')?.valueChanges.subscribe(option => {
            if (option === 'immediate') {
                this.form.get('scheduledSendDate')?.disable();
            } else {
                this.form.get('scheduledSendDate')?.enable();
            }
        });

        // Initial disabling/enabling of scheduledSendDate
        const currentSendOption = this.form.get('sendOption')?.value;
        if (currentSendOption === 'immediate') {
            this.form.get('scheduledSendDate')?.disable();
        } else {
            this.form.get('scheduledSendDate')?.enable();
        }

        // Falls das Formular readonly sein soll (z.B. für SENT Status)
        if (this.invoice && this.invoice.status === Status.SENT) {
            // Nur Status ändern auf PAID erlauben
            this.form.get('company')?.disable();
            this.form.get('contactPerson')?.disable();
            this.form.get('benefits')?.disable();
            this.form.get('invoiceDate')?.disable();
            this.form.get('paymentDeadline')?.disable();
            this.form.get('sendOption')?.disable();
            this.form.get('scheduledSendDate')?.disable();
            // Ermögliche nur die Statusänderung
        }
    }

    /**
     * Berechnet den Gesamtbetrag basierend auf den ausgewählten Leistungen.
     * @param selectedBenefitIds IDs der ausgewählten Leistungen
     */
    calculateTotalAmount(selectedBenefitIds: string[]): void {
        const selectedBenefits = this.benefits.filter(b => selectedBenefitIds.includes(b.id!));
        const total = selectedBenefits.reduce((sum, benefit) => sum + (benefit.price || 0), 0);
        this.form.get('totalAmount')?.setValue(total);
    }

    cancel(): void {
        this.dialogRef.close();
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
                contactPerson: selectedContactPerson!,
                benefits: selectedBenefits,
                invoiceDate: formValue.invoiceDate,
                paymentDeadline: formValue.paymentDeadline,
                status: formValue.status, // Status setzen
                totalAmount: selectedBenefits.reduce((sum, b) => sum + (b.price || 0), 0),
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

    private loadContactPersons(companyId: string) {
        this.companyService.getContactPersonsByCompany(companyId).subscribe({
            next: (data) => {
                this.contactPersons = data;
            },
            error: (error) => {
                console.error('Fehler beim Laden der Ansprechpartner', error);
            }
        });
    }

    private loadBenefits() {
        this.benefitService.getBenefits().subscribe({
            next: (data) => {
                this.benefits = data;
            },
            error: (error) => {
                console.error('Fehler beim Laden der Leistungen', error);
            }
        });
    }

    private loadCompanies() {
        this.companyService.getCompanies().subscribe({
            next: (data) => {
                this.companies = data;
            },
            error: (error) => {
                console.error('Fehler beim Laden der Unternehmen', error);
            }
        });
    }
}