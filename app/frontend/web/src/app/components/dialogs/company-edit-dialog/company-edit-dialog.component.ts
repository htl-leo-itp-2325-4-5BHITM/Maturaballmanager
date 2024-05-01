import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions, MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactPerson} from "../../../model/ContactPerson";
import {Company} from "../../../model/Company";
import {CompanyService} from "../../../services/company.service";
import {CompanyDetailDTO} from "../../../model/dto/CompanyDetailDTO";

@Component({
    selector: 'app-company-edit-dialog',
    standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        FormsModule,
        MatDialogClose
    ],
    templateUrl: './company-edit-dialog.component.html',
    styleUrl: './company-edit-dialog.component.scss'
})
export class CompanyEditDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<CompanyEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public company: CompanyDetailDTO) {
        console.log(company)
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
