// src/app/components/confirm-dialog/confirm-dialog.component.ts
import { Component, Input } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogRef } from '@nebular/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    NbCardModule,
    NbButtonModule,
    CommonModule
  ],
  styles: []
})
export class ConfirmDialogComponent {
  @Input() title: string = "";
  @Input() message: string = "";

  constructor(
      protected dialogRef: NbDialogRef<ConfirmDialogComponent>
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}