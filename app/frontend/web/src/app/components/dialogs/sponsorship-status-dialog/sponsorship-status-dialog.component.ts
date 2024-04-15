import {Component, Inject} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-sponsorship-status-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatDialogContent,
    MatDialogTitle,
    MatOption,
      MatLabel,
    NgForOf,
    MatButton,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './sponsorship-status-dialog.component.html',
  styleUrl: './sponsorship-status-dialog.component.scss'
})
export class SponsorshipStatusDialogComponent {
  currentStatus: string;
  statusList: string[] = ['Aktiv', 'Inaktiv', 'In Bearbeitung'];

  constructor(
      public dialogRef: MatDialogRef<SponsorshipStatusDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentStatus = data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
