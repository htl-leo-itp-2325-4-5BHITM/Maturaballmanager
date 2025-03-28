// contact-person-dialog.component.ts

import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbInputModule, NbRadioModule } from '@nebular/theme';
import { Company } from '../../../model/companies';
import { ContactPerson } from '../../../model/contactperson';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-person-dialog',
  templateUrl: './contact-person-dialog.component.html',
  styleUrls: ['./contact-person-dialog.component.scss'],
  standalone: true,
  imports: [
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbInputModule,
    NgIf,
    ReactiveFormsModule,
    NbRadioModule,
  ],
})
export class ContactPersonDialogComponent implements OnInit {
  @Input() title: string = '';
  @Input() company: Company | null = null;
  @Input() contactPerson: ContactPerson | null = null;

  form: FormGroup = new FormGroup({});

  constructor(
      private fb: FormBuilder,
      protected dialogRef: NbDialogRef<ContactPersonDialogComponent>
  ) {}

  ngOnInit(): void {
    const phonePattern = '^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$';

    this.form = this.fb.group({
      id: [this.contactPerson?.id],
      prefixTitle: [this.contactPerson?.prefixTitle || ''],
      firstName: [this.contactPerson?.firstName || '', [Validators.required, Validators.maxLength(50)]],
      lastName: [this.contactPerson?.lastName || '', [Validators.required, Validators.maxLength(50)]],
      suffixTitle: [this.contactPerson?.suffixTitle || ''],
      gender: [this.contactPerson?.gender || '', [Validators.required, Validators.pattern('M|W|D')]],
      position: [this.contactPerson?.position || '', [Validators.required, Validators.maxLength(100)]],
      personalEmail: [this.contactPerson?.personalEmail || '', [Validators.email]],
      personalPhone: [this.contactPerson?.personalPhone || '', [Validators.pattern(phonePattern)]],
    });
  }

  submit(): void {
    if (this.form.valid) {
      const contactPerson: ContactPerson = this.form.value;
      this.dialogRef.close(contactPerson);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}