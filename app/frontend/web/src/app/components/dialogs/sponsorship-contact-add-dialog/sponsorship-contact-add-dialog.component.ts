import {Component, Inject} from '@angular/core';
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
import {FormsModule} from "@angular/forms";
import {ContactPerson} from "../../../model/ContactPerson";

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
        MatLabel
    ],
    templateUrl: './sponsorship-contact-add-dialog.component.html',
    styleUrl: './sponsorship-contact-add-dialog.component.scss'
})
export class SponsorshipContactAddDialogComponent {
    contactPerson: ContactPerson = { } as ContactPerson

    constructor(
        public dialogRef: MatDialogRef<SponsorshipContactAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
