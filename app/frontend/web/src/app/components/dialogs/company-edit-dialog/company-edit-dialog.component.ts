import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {CompanyService} from "../../../services/company.service";
import {CompanyFormData} from "../../../model/dto/CompanyFormData";
import {ContactPerson} from "../../../model/ContactPerson";

@Component({
    selector: 'app-company-edit-dialog',
    standalone: true,
    templateUrl: './company-edit-dialog.component.html',
    imports: [
        NgForOf,
        NgIf,
        MatLabel,
        MatButton,
        MatStepperPrevious,
        MatDialogActions,
        MatStepperNext,
        MatStep,
        MatStepLabel,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        MatIconButton,
        MatIcon,
        MatStepper,
        MatDialogTitle,
        MatCheckbox
    ],
    styleUrls: ['./company-edit-dialog.component.scss']
})
export class CompanyEditDialogComponent {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CompanyEditDialogComponent>,
        private formBuilder: FormBuilder,
        private companyService: CompanyService,
        @Inject(MAT_DIALOG_DATA) public company: any) {
        this.firstFormGroup = this.formBuilder.group({
            companyName: [this.company?.companyName || '', Validators.required],
            website: [this.company?.website || ''],
            officeMail: [this.company?.officeMail || '', [Validators.required, Validators.email]],
            officePhone: [this.company?.officePhone || ''],
            includeAddress: [false],
            includeContactPersons: [false]
        });
        this.secondFormGroup = this.formBuilder.group({
            street: ['', Validators.required],
            town: ['', Validators.required],
            zipCode: ['', Validators.required],
            country: ['', Validators.required]
        });

        this.thirdFormGroup = this.formBuilder.group({
            contactPersons: this.formBuilder.array([])
        });

        if (this.company?.address) {
            this.secondFormGroup.patchValue(this.company.address);
        }

        if (this.company?.contactPersons) {
            this.company.contactPersons.forEach((contact: ContactPerson) => {
                this.addContactPerson(contact);
            });
        } else {
            this.addContactPerson();  // Standard-Kontaktperson-Reihe hinzufügen
        }
    }

    get contactPersons(): FormArray {
        return this.thirdFormGroup.get('contactPersons') as FormArray;
    }

    addContactPerson(contact?: ContactPerson): void {
        this.contactPersons.push(this.formBuilder.group({
            id: [contact?.id || null],
            firstName: [contact?.firstName || '', Validators.required],
            lastName: [contact?.lastName || '', Validators.required],
            mail: [contact?.mail || '', [Validators.required, Validators.email]],
            phoneNumber: [contact?.phoneNumber || ''],
            position: [contact?.position || ''],
            sex: [contact?.sex || '']
        }));
    }

    removeContactPerson(index: number): void {
        this.contactPersons.removeAt(index);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.firstFormGroup.valid &&
            (!this.firstFormGroup.get('includeAddress')?.value || this.secondFormGroup.valid) &&
            (!this.firstFormGroup.get('includeContactPersons')?.value || this.thirdFormGroup.valid)) {
            const formData: CompanyFormData = {
                id: this.company?.id || null,
                ...this.firstFormGroup.value,
                address: this.firstFormGroup.get('includeAddress')?.value ? { ...this.secondFormGroup.value } : null,
                contactPersons: this.firstFormGroup.get('includeContactPersons')?.value ? this.thirdFormGroup.value.contactPersons : []
            };

            this.companyService.updateCompany(formData).subscribe({
                next: (response) => {
                    console.log('Company updated successfully', response);
                    this.companyService.companyUpdatedNotification(response);
                    this.dialogRef.close(formData);
                },
                error: (error) => {
                    console.error('Failed to update company', error);
                }
            });
        }
    }
}