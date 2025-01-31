import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbFormFieldModule,
    NbCardModule,
    NbDatepickerModule,
    NbRadioModule,
    NbOptionModule,
    NbToastrService,
    NbDialogRef
} from '@nebular/theme';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { of } from 'rxjs';
import { provideNebular } from '../../../nebular.providers';
import { InvoiceDTO } from '../../../model/dtos/invoice.dto';
import { Company } from '../../../model/companies';
import { ContactPerson } from '../../../model/contactperson';
import { Benefit } from '../../../model/benefit';
import { CompanyService } from '../../../services/company.service';
import { BenefitService } from '../../../services/benefit.service';
import { InvoiceService } from '../../../services/invoice.service';
import { Status } from '../../../model/invoice';

@Component({
    selector: 'app-invoice-dialog',
    templateUrl: './invoice-dialog.component.html',
    styleUrls: ['./invoice-dialog.component.scss'],
    standalone: true,
    imports: [
        // Nebular & Angular Modules
        NbRadioModule,
        NbCardModule,
        NbButtonModule,
        NbInputModule,
        ReactiveFormsModule,
        NbDatepickerModule,
        NgIf,
        NbFormFieldModule,
        NbOptionModule,
        NbSelectModule,
        NgForOf,
    ],
    providers: [provideNebular()],
})
export class InvoiceDialogComponent implements OnInit {
    @Input() title: string = '';
    @Input() invoice: InvoiceDTO = {} as InvoiceDTO;

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
            contactPerson: [null], // optional
            benefits: [[], Validators.required],
            invoiceDate: [new Date(), Validators.required],
            paymentDeadline: [null, Validators.required],
            sendOption: ['immediate', Validators.required],
            totalAmount: [0.0, Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadCompanies();
        this.loadBenefits();

        // Standard: Wenn im Input-Invoice bereits Firma gesetzt, Kontaktpersonen laden
        if (this.invoice.company) {
            this.loadContactPersons(this.invoice.company);
        }

        // Falls wir eine existierende Rechnung bearbeiten
        if (this.invoice) {
            this.form.patchValue({
                company: this.invoice.company,
                contactPerson: this.invoice.contactPerson ?? null,
                benefits: this.invoice.benefits ?? [],
                invoiceDate: this.invoice.invoiceDate ? new Date(this.invoice.invoiceDate) : new Date(),
                paymentDeadline: this.invoice.paymentDeadline ? new Date(this.invoice.paymentDeadline) : null,
                sendOption: this.invoice.sendOption === 'onDate' ? 'onDate' : 'immediate',
                totalAmount: this.invoice.totalAmount || 0.0,
            });
        }

        // 1) **Zahlungsfrist standardmäßig auf +14 Tage** vom heutigen Tag
        const currentPaymentDeadline = this.form.get('paymentDeadline')?.value;
        if (!currentPaymentDeadline) {
            const in14Days = new Date();
            in14Days.setDate(in14Days.getDate() + 14);
            this.form.get('paymentDeadline')?.setValue(in14Days);
        }

        // 2) Wenn user das Rechnungsdatum ändert => Zahlungsfrist = invoiceDate + 14
        this.form.get('invoiceDate')?.valueChanges.subscribe((date: Date) => {
            if (date) {
                const deadline = new Date(date);
                deadline.setDate(deadline.getDate() + 14);
                this.form.get('paymentDeadline')?.setValue(deadline);
            }
        });

        // 3) Firma-Change => loadContactPersons
        this.form.get('company')?.valueChanges.subscribe((companyId) => {
            this.loadContactPersons(companyId);
        });

        // 4) Benefits-Change => calculateTotalAmount
        this.form.get('benefits')?.valueChanges.subscribe((selectedBenefitIds: string[]) => {
            this.calculateTotalAmount(selectedBenefitIds);
        });

        // 5) Beobachte Änderungen an den Feldern 'invoiceDate' und 'paymentDeadline' für die Validierung
        this.form.get('invoiceDate')?.valueChanges.subscribe(() => this.validatePaymentDeadline());
        this.form.get('paymentDeadline')?.valueChanges.subscribe(() => this.validatePaymentDeadline());
    }

    /**
     * Berechnet den Gesamtbetrag basierend auf den ausgewählten Leistungen.
     */
    calculateTotalAmount(selectedBenefitIds: string[]): void {
        const selectedBenefits = this.benefits.filter((b) => selectedBenefitIds.includes(b.id!));
        const total = selectedBenefits.reduce((sum, benefit) => sum + (benefit.price || 0.0), 0);
        this.form.get('totalAmount')?.setValue(total, { emitEvent: false });
    }

    /**
     * Validiert, dass die Zahlungsfrist nicht vor dem Rechnungsdatum liegt.
     */
    validatePaymentDeadline(): void {
        const invoiceDate = this.form.get('invoiceDate')?.value;
        const paymentDeadline = this.form.get('paymentDeadline')?.value;

        if (!invoiceDate || (paymentDeadline && new Date(paymentDeadline) < new Date(invoiceDate))) {
            this.form.get('paymentDeadline')?.setErrors({ invalidDeadline: true });
        } else {
            this.form.get('paymentDeadline')?.setErrors(null);
        }
    }


    /**
     * Klick auf "Abbrechen"
     */
    cancel(): void {
        this.dialogRef.close();
    }

    /**
     * Klick auf "Speichern"
     */
    submit(): void {
        // A) Zuerst: Standard-Formular-Validierung
        if (this.form.invalid) {
            this.toastrService.danger('Bitte füllen Sie alle erforderlichen Felder aus.', 'Ungültige Eingabe');
            return;
        }

        // B) Prüfen, ob Kontaktperson gewählt und ob die nötigen Daten existieren
        const contactPersonId = this.form.get('contactPerson')?.value;
        if (contactPersonId) {
            const cp = this.contactPersons.find((c) => c.id === contactPersonId);
            if (cp && !cp.personalEmail) {
                this.toastrService.danger(
                    'Die gewählte Kontaktperson hat keine E-Mail-Adresse hinterlegt.',
                    'Ungültige Kontaktperson'
                );
                return;
            }
        }

        // C) Baue die Daten für das InvoiceDTO
        const formValue = this.form.value;
        const selectedCompany = this.companies.find((c) => c.id === formValue.company);
        const selectedContactPerson = contactPersonId
            ? this.contactPersons.find((cp) => cp.id === contactPersonId)
            : null;
        const selectedBenefits = this.benefits.filter((b) => formValue.benefits.includes(b.id));

        // D) Speichere das, was wir dem Aufrufer zurückgeben wollen
        const sendOption = formValue.sendOption as 'immediate' | 'onDate';

        this.dialogRef.close({
            id: this.invoice?.id as string,
            company: selectedCompany?.id!,
            contactPerson: selectedContactPerson?.id!,
            benefits: selectedBenefits.map((b) => b.id!),
            invoiceDate: formValue.invoiceDate as Date,
            paymentDeadline: formValue.paymentDeadline as Date,
            totalAmount: formValue.totalAmount as number,
            status: this.invoice?.status ?? 'DRAFT',
            sendOption,
        });
    }

    /**
     * Lädt mögliche Kontaktpersonen zu einer Firma
     */
    private loadContactPersons(companyId: string) {
        if (!companyId) {
            this.contactPersons = [];
            return;
        }
        this.companyService.getContactPersonsByCompany(companyId).subscribe({
            next: (data) => {
                this.contactPersons = data;
            },
            error: (error) => {
                console.error('Fehler beim Laden der Ansprechpartner', error);
            },
        });
    }

    /**
     * Lädt alle verfügbaren Leistungen
     */
    private loadBenefits() {
        this.benefitService.getBenefits().subscribe({
            next: (data) => {
                this.benefits = data;
            },
            error: (error) => {
                console.error('Fehler beim Laden der Leistungen', error);
            },
        });
    }

    /**
     * Lädt alle Firmen
     */
    private loadCompanies() {
        this.companyService.getCompanies().subscribe({
            next: (data) => {
                this.companies = data;
            },
            error: (error) => {
                console.error('Fehler beim Laden der Unternehmen', error);
            },
        });
    }
}
