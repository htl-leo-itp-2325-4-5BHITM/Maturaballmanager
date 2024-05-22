import {Component, inject, Inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ContactPerson} from "../../../model/ContactPerson";
import {CompanyService} from "../../../services/company.service";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-sponsorship-contact-add-dialog',
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        FormsModule,
        MatLabel,
        MatSelect,
        MatOption,
        ReactiveFormsModule,
        NgForOf
    ],
    templateUrl: './sponsorship-contact-add-dialog.component.html',
    styleUrl: './sponsorship-contact-add-dialog.component.scss'
})
export class SponsorshipContactAddDialogComponent {
    contactPersonForm: FormGroup;
    sexes = [
        { value: 'M', viewValue: 'männlich' },
        { value: 'F', viewValue: 'weiblich' }
    ];

    constructor(
        public dialogRef: MatDialogRef<SponsorshipContactAddDialogComponent>,
        private formBuilder: FormBuilder,
        private companyService: CompanyService = inject(CompanyService),
        @Inject(MAT_DIALOG_DATA) public data: ContactPerson) {

        this.contactPersonForm = this.formBuilder.group({
            id: [data?.id || null],
            firstName: [data?.firstName || '', Validators.required],
            lastName: [data?.lastName || '', Validators.required],
            position: [data?.position || ''],
            mail: [data?.mail || '', [Validators.required, Validators.email]],
            phoneNumber: [data?.phoneNumber || ''],
            sex: [data?.sex || '', Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.contactPersonForm.valid) {
            const contactPersonData: ContactPerson = this.contactPersonForm.value;
            this.companyService.saveContactPerson(contactPersonData).subscribe({
                next: (response) => {
                    console.log('Contact person saved successfully', response);
                    this.dialogRef.close(response);
                },
                error: (error) => {
                    console.error('Failed to save contact person', error);
                }
            });
        }
    }
}