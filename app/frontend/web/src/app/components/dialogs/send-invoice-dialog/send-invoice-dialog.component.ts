import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDialogRef,
    NbFormFieldModule,
    NbSelectModule,
    NbToastrService
} from '@nebular/theme';
import {CommonModule, NgIf} from '@angular/common';
import {Invoice} from '../../../model/invoice';
import {Company} from '../../../model/companies';
import {provideNebular} from "../../../nebular.providers";
import {InvoiceService} from '../../../services/invoice.service';
import {CompanyService} from "../../../services/company.service";
import {InvoiceSendCheckResult} from "../../../model/dtos/invoice-send-check-result.dto";

@Component({
    selector: 'app-send-invoice-dialog',
    templateUrl: './send-invoice-dialog.component.html',
    styleUrls: ['./send-invoice-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbCardModule,
        NbButtonModule,
        NbSelectModule,
        NbCheckboxModule,
        NbFormFieldModule,
        NgIf
    ],
    providers: [provideNebular()]
})
export class SendInvoiceDialogComponent implements OnInit {
    @Input() invoice: Invoice = {} as Invoice;

    form: FormGroup;
    availableEmailOptions: { value: 'OFFICE' | 'CONTACT_PERSON', label: string, email: string }[] = [];
    isEmailValid: boolean = false;

    constructor(
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private toastrService: NbToastrService,
        private companyService: CompanyService,
        protected dialogRef: NbDialogRef<SendInvoiceDialogComponent>
    ) {
        this.form = this.fb.group({
            emailTarget: [null, Validators.required],
            confirm: [false, Validators.requiredTrue]
        });
    }

    ngOnInit(): void {
        this.initializeEmailOptions();

        // Überwachen von Änderungen zur Validierung
        this.form.get('emailTarget')?.valueChanges.subscribe(() => {
            this.validateEmailSelection();
        });
        this.form.get('confirm')?.valueChanges.subscribe(() => {
            this.validateEmailSelection();
        });
    }

    /**
     * Initialisiert die verfügbaren E-Mail-Optionen basierend auf der Verfügbarkeit von Kontaktpersonen und Büro-E-Mail.
     */
    async initializeEmailOptions() {
        const company = await this.companyService.getCompanyById(this.invoice.company).toPromise();
        const contactPersons = await this.companyService.getContactPersonsByCompany(company?.id!).toPromise();

        let contactPerson = contactPersons?.find(cp => cp.id! === this.invoice!.contactPerson);

        if (company && company.officeEmail) {
            this.availableEmailOptions.push({
                value: 'OFFICE',
                label: 'Büro-E-Mail',
                email: company.officeEmail
            });
        }

        // Kontaktperson-E-Mail nur hinzufügen, wenn sie existiert
        if (contactPerson && contactPerson.personalEmail) {
            this.availableEmailOptions.push({
                value: 'CONTACT_PERSON',
                label: `Kontaktperson: ${contactPerson.firstName} ${contactPerson.lastName}`,
                email: contactPerson.personalEmail
            });
        }
    }

    /**
     * Überprüft, ob die ausgewählte E-Mail-Adresse geeignet ist.
     */
    private validateEmailSelection(): void {
        const emailTarget = this.form.get('emailTarget')?.value;
        const confirm = this.form.get('confirm')?.value;

        if (!emailTarget || !confirm) {
            this.isEmailValid = false;
            return;
        }

        const selectedOption = this.availableEmailOptions.find(opt => opt.value === emailTarget);

        if (selectedOption && selectedOption.email) {
            // Weitere Validierungen können hier hinzugefügt werden, z.B. Regex-Check für E-Mail
            this.isEmailValid = true;
        } else {
            this.isEmailValid = false;
            this.toastrService.danger('Die ausgewählte E-Mail-Adresse ist nicht gültig.', 'Ungültige E-Mail');
        }
    }

    /**
     * Schließt den Dialog und sendet die ausgewählte E-Mail-Zielauswahl zurück.
     */
    sendEmail(): void {
        this.invoiceService.checkIfInvoiceIsSendable(this.invoice.id!)
            .subscribe({
                next: (checkResult: InvoiceSendCheckResult) => {
                    if (!checkResult.valid) {
                        this.toastrService.warning(
                            `Es fehlen noch Pflichtfelder:\n${checkResult.missingFields?.join('\n')}`,
                            'Rechnung unvollständig'
                        );
                        return;
                    }

                    if (this.isEmailValid) {
                        const selectedOption = this.availableEmailOptions
                            .find(opt => opt.value === this.form.get('emailTarget')?.value);

                        if (selectedOption) {
                            this.invoiceService.sendInvoice(this.invoice.id!, selectedOption.value).subscribe({
                                next: () => {
                                    this.toastrService.success('Rechnung erfolgreich versendet.', 'Erfolg');
                                    this.dialogRef.close(true);
                                },
                                error: (error) => {
                                    this.toastrService.danger('Fehler beim Versenden der Rechnung.', 'Fehler');
                                    console.error(error);
                                }
                            });
                        }
                    } else {
                        this.toastrService.danger('Bitte überprüfen Sie Ihre Auswahl.', 'Ungültige Auswahl');
                    }
                },
                error: (err) => {
                    if (err.status === 400 && err.error?.missingFields) {
                        // Bei 400 BAD_REQUEST bekommen wir i. d. R. das Check-Result im Body:
                        this.toastrService.warning(
                            `Es fehlen noch Pflichtfelder:\n${err.error.missingFields.join('\n')}`,
                            'Rechnung unvollständig'
                        );
                    } else {
                        this.toastrService.danger('Fehler bei der Validierung der Rechnung.', 'Fehler');
                        console.error(err);
                    }
                }
            });
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}
