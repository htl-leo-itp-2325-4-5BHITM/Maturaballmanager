// src/app/components/company-dialog/company-dialog.component.ts

import { Component, Input, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import {
  NbDialogRef,
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbRadioModule,
  NbCheckboxModule,
  NbIconModule,
  NbOptionModule, NbSelectModule
} from '@nebular/theme';
import { Company } from "../../../model/companies";
import { ContactPerson } from "../../../model/contactperson";
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  standalone: true,
  imports: [
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbRadioModule,
    NbCheckboxModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NbIconModule,
    NbOptionModule,
    NbSelectModule
  ],
  styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent implements OnInit {
  @Input() title: string = "";
  @Input() company: Company | null = null;

  form: FormGroup = new FormGroup({});
  currentStep: number = 1;
  totalSteps: number = 1;
  showAddress: boolean = false;
  showContactPersons: boolean = false;

  constructor(
      private fb: FormBuilder,
      protected dialogRef: NbDialogRef<CompanyDialogComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.company?.id],
      name: [this.company?.name || '', Validators.required],
      industry: [this.company?.industry || '', Validators.required],
      website: [this.company?.website || ''],
      officePhone: [this.company?.officePhone || ''],
      officeEmail: [this.company?.officeEmail || '', Validators.email],
      includeAddress: [!!this.company?.address],
      includeContactPersons: [!!(this.company?.contactPersons && this.company.contactPersons.length > 0)],
      address: this.fb.group({
        street: [this.company?.address?.street || ''],
        houseNumber: [this.company?.address?.houseNumber || ''],
        floor: [this.company?.address?.floor || ''],
        door: [this.company?.address?.door || ''],
        postalCode: [this.company?.address?.postalCode || ''],
        city: [this.company?.address?.city || '']
      }),
      contactPersons: this.fb.array([]),
    });

    this.showAddress = this.form.get('includeAddress')?.value;
    this.showContactPersons = this.form.get('includeContactPersons')?.value;

    if (this.company?.contactPersons && this.showContactPersons) {
      this.company.contactPersons.forEach(cp => this.addContactPerson(cp));
    } else {
      this.addContactPerson(); // Mindestens eine Kontaktperson sicherstellen
    }

    this.form.get('includeAddress')?.valueChanges.subscribe(value => {
      this.showAddress = value;
      this.updateTotalSteps();
      const addressGroup = this.form.get('address');
      if (value) {
        addressGroup?.enable();
      } else {
        addressGroup?.disable();
        addressGroup?.reset();
      }
    });

    this.form.get('includeContactPersons')?.valueChanges.subscribe(value => {
      this.showContactPersons = value;
      this.updateTotalSteps();
      const contactPersonsArray = this.contactPersons;
      if (value) {
        contactPersonsArray.enable();
      } else {
        contactPersonsArray.disable();
        contactPersonsArray.clear();
        this.addContactPerson(); // Mindestens eine Kontaktperson sicherstellen
      }
    });

    // Initiale Aktivierung oder Deaktivierung der optionalen Bereiche
    const addressGroup = this.form.get('address');
    if (!this.showAddress) {
      addressGroup?.disable();
    }

    const contactPersonsArray = this.contactPersons;
    if (!this.showContactPersons) {
      contactPersonsArray.disable();
      contactPersonsArray.clear();
      this.addContactPerson(); // Mindestens eine Kontaktperson sicherstellen
    }

    // Initiale Berechnung der Gesamtanzahl der Schritte
    this.updateTotalSteps();
  }

  get contactPersons(): FormArray {
    return this.form.get('contactPersons') as FormArray;
  }

  @ViewChildren('contactPerson') contactPersonsElements!: QueryList<ElementRef>;

  addContactPerson(contact?: ContactPerson): void {
    this.contactPersons.push(this.fb.group({
      prefixTitle: [contact?.prefixTitle || ''],
      firstName: [contact?.firstName || '', Validators.required],
      lastName: [contact?.lastName || '', Validators.required],
      suffixTitle: [contact?.suffixTitle || ''],
      gender: [contact?.gender || 'M', Validators.required],
      position: [contact?.position || '', Validators.required],
      personalEmail: [contact?.personalEmail || '', Validators.email],
      personalPhone: [contact?.personalPhone || '']
    }));

    setTimeout(() => {
      if (this.contactPersonsElements.length > 0) {
        const lastElement = this.contactPersonsElements.last.nativeElement;
        lastElement.scrollIntoView({behavior: 'smooth', block: 'end'});
      }
    }, 100);
  }

  removeContactPerson(index: number): void {
    if (this.contactPersons.length > 1) {
      this.contactPersons.removeAt(index);
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit(): void {
    if (this.isFormValid()) {
      const company: Company = this.form.value;
      if (!this.showAddress) {
        company.address = undefined;
      }
      if (!this.showContactPersons) {
        company.contactPersons = [];
      }
      this.dialogRef.close(company);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Überprüft die Gültigkeit des aktuellen Schritts.
   */
  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return (this.form.get('name')?.valid &&
            this.form.get('industry')?.valid &&
            this.form.get('officeEmail')?.valid) ?? false;
      case 2:
        if (this.showAddress) {
          return this.form.get('address')?.valid ?? false;
        } else if (this.showContactPersons) {
          return this.contactPersons.valid;
        }
        return true;
      case 3:
        return this.contactPersons.valid;
      default:
        return false;
    }
  }

  /**
   * Überprüft die Gültigkeit des gesamten Formulars, unter Berücksichtigung der optionalen Abschnitte.
   */
  isFormValid(): boolean {
    if (this.showAddress && !this.form.get('address')?.valid) {
      return false;
    }
    if (this.showContactPersons && !this.contactPersons.valid) {
      return false;
    }
    return (this.form.get('name')?.valid &&
        this.form.get('industry')?.valid &&
        this.form.get('officeEmail')?.valid) ?? false;
  }

  /**
   * Aktualisiert die Gesamtanzahl der Schritte basierend auf den ausgewählten Optionen.
   */
  private updateTotalSteps(): void {
    this.totalSteps = 1; // Allgemein ist immer vorhanden
    if (this.showAddress) {
      this.totalSteps++;
    }
    if (this.showContactPersons) {
      this.totalSteps++;
    }
    if (this.currentStep > this.totalSteps) {
      this.currentStep = this.totalSteps;
    }
  }
}