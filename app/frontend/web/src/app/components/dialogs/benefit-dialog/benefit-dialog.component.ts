// src/app/components/benefit-dialog/benefit-dialog.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NbDialogRef, NbCardModule, NbButtonModule, NbInputModule, NbIconModule, NbFormFieldModule, NbAlertModule } from '@nebular/theme';
import { NgIf } from '@angular/common';
import {Benefit} from "../../../model/benefit";

@Component({
  selector: 'app-benefit-dialog',
  templateUrl: './benefit-dialog.component.html',
  styleUrls: ['./benefit-dialog.component.scss'],
  standalone: true,
  imports: [
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    ReactiveFormsModule,
    NgIf,
    NbAlertModule
  ]
})
export class BenefitDialogComponent implements OnInit {
  @Input() title: string = '';
  @Input() benefit: Benefit | null = null;

  form: FormGroup = new FormGroup({});
  submitted: boolean = false;

  constructor(
      private fb: FormBuilder,
      protected dialogRef: NbDialogRef<BenefitDialogComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.benefit?.id],
      name: [this.benefit?.name || '', Validators.required],
      description: [this.benefit?.description || ''],
      price: [this.benefit?.price || 0.0, [Validators.required, Validators.min(0)]]
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.valid) {
      const benefit: Benefit = this.form.value;
      this.dialogRef.close(benefit);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}