// src/app/components/company-dialog/company-dialog.component.ts

import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogRef, NbDialogService,
  NbIconModule,
  NbInputModule,
  NbRadioModule
} from '@nebular/theme';
import { Company } from "../../../model/companies";
import { NgForOf, NgIf } from "@angular/common";
import {Router} from "@angular/router";
import {
  CompanyContactPersonDialogComponent
} from "../company-contact-person-dialog/company-contact-person-dialog.component";

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss'],
  standalone: true,
  imports: [
    NbIconModule,
    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NbInputModule,
    NbCheckboxModule,
    NbRadioModule
  ]
})
export class CompanyDialogComponent implements OnInit {
  @Input() title: string = "";
  @Input() company: Company | null = null;

  form: FormGroup = new FormGroup({});
  showAddress: boolean = false;

  constructor(
      private fb: FormBuilder,
      protected dialogRef: NbDialogRef<CompanyDialogComponent>,
      private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    const urlPattern = '^$|^(https?:\\/\\/)?' +
        '((([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]{2,}))|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*' +
        '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' +
        '(\\#[-a-zA-Z0-9_]*)?$';
    const phonePattern = '^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$';

    this.form = this.fb.group({
      id: [this.company?.id],
      name: [this.company?.name || '', [Validators.required, Validators.maxLength(50)]],
      industry: [this.company?.industry || '', [Validators.required, Validators.maxLength(20)]],
      website: [this.company?.website || '', [Validators.pattern(urlPattern)]],
      officePhone: [this.company?.officePhone || '', [Validators.pattern(phonePattern)]],
      officeEmail: [this.company?.officeEmail || '', [Validators.email, Validators.required, Validators.maxLength(50)]],
      includeAddress: [!!this.company?.address],
      address: this.fb.group({
        street: [this.company?.address?.street || '', [Validators.required]],
        houseNumber: [this.company?.address?.houseNumber || '', [Validators.required]],
        postalCode: [this.company?.address?.postalCode || '', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
        city: [this.company?.address?.city || '', [Validators.required]],
      }),
    });

    this.showAddress = this.form.get('includeAddress')?.value;
    this.form.get('includeAddress')?.valueChanges.subscribe(value => {
      this.showAddress = value;
      const addressGroup = this.form.get('address');
      if (value) {
        addressGroup?.enable();
      } else {
        addressGroup?.disable();
        addressGroup?.reset();
      }
    });

    const addressGroup = this.form.get('address');
    if (!this.showAddress) {
      addressGroup?.disable();
    }
  }

  submit(): void {
    if (this.isFormValid()) {
      const company: Company = this.form.value;
      if (!this.showAddress) {
        company.address = undefined;
      }
      this.dialogRef.close(company);
    } else {
      // Mark all controls as touched to show validation errors
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  navigateToContacts() {
      console.log("navigateToContacts wurde aufgerufen");
      this.dialogService.open(CompanyContactPersonDialogComponent, {
        context: {
          companyId: this.company?.id
        }
      });
  }
}