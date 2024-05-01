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
    company: Company = {} as Company

    constructor(
        public dialogRef: MatDialogRef<CompanyEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
