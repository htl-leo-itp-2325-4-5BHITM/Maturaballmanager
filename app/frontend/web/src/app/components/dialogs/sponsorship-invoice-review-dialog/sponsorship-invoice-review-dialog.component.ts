import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {
  SponsorshipInvoiceAddDialogComponent
} from "../sponsorship-invoice-add-dialog/sponsorship-invoice-add-dialog.component";

@Component({
  selector: 'app-sponsorship-invoice-review-dialog',
  standalone: true,
    imports: [
        MatDialogActions,
        MatButton,
        MatLabel,
        MatFormField,
        MatCheckbox,
        FormsModule,
        NgIf,
        MatInput,
        NgForOf,
        MatDialogContent,
        MatDialogTitle,
        CurrencyPipe
    ],
  templateUrl: './sponsorship-invoice-review-dialog.component.html',
  styleUrl: './sponsorship-invoice-review-dialog.component.scss'
})
export class SponsorshipInvoiceReviewDialogComponent {
  confirmationChecked = false;
  sendByEmail = false;
  emailAddress = '';

  constructor(
      public dialogRef: MatDialogRef<SponsorshipInvoiceReviewDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: MatDialog) {}

  goBack(): void {
    const editDialogRef = this.dialog.open(SponsorshipInvoiceAddDialogComponent, { width: '600px', data: this.data });
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data = result;
      }
    });
    this.dialogRef.close();
  }

  finalizeInvoice(): void {
    if (this.sendByEmail && this.emailAddress) {
      console.log('Sending invoice via email to:', this.emailAddress);
    }
    console.log('Invoice finalized:', this.data);
    this.dialogRef.close({ finalizedData: this.data, sendByEmail: this.sendByEmail, emailAddress: this.emailAddress });
  }
}
