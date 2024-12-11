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
    NbDatepickerModule, NbRadioModule, NbBadgeModule
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
import {InvoiceDTO} from "../../../model/dtos/invoice.dto";

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
        NbBadgeModule,
    ],
    providers: [provideNebular()]
})
export class InvoiceDialogComponent implements OnInit {
    @Input() title: string = '';
    @Input() invoice: Invoice | InvoiceDTO = {} as Invoice;

    form: FormGroup;

    sendOptions = [
        { value: 'immediate', label: 'Direkt versenden' },
        { value: 'onDate', label: 'Am Rechnungsdatum versenden' }
    ];

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
            sendOption: ['immediate', Validators.required],
            scheduledSendDate: [{ value: null, disabled: true }],
            totalAmount: [{ value: 0, disabled: true }],
        });
    }

    getStatusTag(status: string): string {
        switch (status) {
            case 'SENT':
                return 'info';
            case 'PAID':
                return 'success';
            case 'DRAFT':
            default:
                return 'warning';
        }
    }

    ngOnInit(): void {
        this.loadCompanies();
        this.loadBenefits();
        this.loadContactPersons(this.invoice?.company);

        this.statusOptions = [Status.DRAFT, Status.SENT, Status.PAID];

        console.log(this.invoice)
        if (this.invoice) {
            this.form.patchValue({
                company: this.invoice?.company,
                contactPerson: this.invoice?.contactPerson ?? undefined,
                benefits: this.invoice?.benefits || [],
                invoiceDate: this.invoice.invoiceDate ? new Date(this.invoice.invoiceDate) : new Date(),
                paymentDeadline: this.invoice.paymentDeadline ? new Date(this.invoice.paymentDeadline) : null,
                sendOption: this.invoice.status === Status.SENT ? 'immediate' : 'immediate',
                status: this.invoice.status,
            });
            this.loadContactPersons(this.invoice.company);
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
                deadline.setDate(deadline.getDate() + 14);
                this.form.get('paymentDeadline')?.setValue(deadline);
            }
        });

        this.form.get('sendOption')?.valueChanges.subscribe(option => {
            if (option === 'immediate') {
                this.form.get('scheduledSendDate')?.disable();
            } else {
                this.form.get('scheduledSendDate')?.enable();
            }
        });

        const currentSendOption = this.form.get('sendOption')?.value;
        if (currentSendOption === 'immediate') {
            this.form.get('scheduledSendDate')?.disable();
        } else {
            this.form.get('scheduledSendDate')?.enable();
        }

        if (this.invoice && this.invoice.status === Status.SENT) {
            this.form.get('company')?.disable();
            this.form.get('contactPerson')?.disable();
            this.form.get('benefits')?.disable();
            this.form.get('invoiceDate')?.disable();
            this.form.get('paymentDeadline')?.disable();
            this.form.get('sendOption')?.disable();
            this.form.get('scheduledSendDate')?.disable();
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

            this.dialogRef.close({
                id: this.invoice?.id as string,
                company: selectedCompany?.id!,
                contactPerson: selectedContactPerson?.id!,
                benefits: selectedBenefits.map(b => b.id!),
                invoiceDate: formValue.invoiceDate as Date,
                paymentDeadline: formValue.paymentDeadline as Date,
                status: formValue.status as Status,
                totalAmount: formValue.totalAmount as number,
            });
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