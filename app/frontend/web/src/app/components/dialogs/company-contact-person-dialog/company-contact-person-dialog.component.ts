import {Component, Input, OnInit} from '@angular/core';
import {NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbInputModule, NbRadioModule} from "@nebular/theme";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CompanyService} from "../../../services/company.service";
import {ContactPerson} from "../../../model/contactperson";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-company-contact-person-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NgIf,
    NgForOf,
    NbButtonModule,
    NbInputModule,
    ReactiveFormsModule,
    NbRadioModule
  ],
  templateUrl: './company-contact-person-dialog.component.html',
  styleUrls: ['./company-contact-person-dialog.component.scss']
})
export class CompanyContactPersonDialogComponent implements OnInit {

  @Input() companyId: string | '' = ''; // Assuming companyId is passed as input

  contacts: ContactPerson[] = [];

  // Formularsteuerung
  showNewContactForm = false;
  newContactForm: FormGroup = this.fb.group({
    prefixTitle: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    suffixTitle: [''],
    gender: ['', Validators.required],
    position: [''],
    personalEmail: ['', [Validators.email]],
    personalPhone: ['']
  });

  constructor(private fb: FormBuilder,
              protected ref: NbDialogRef<CompanyContactPersonDialogComponent>,
              private companyService: CompanyService,)
  {}

  ngOnInit(): void {
    if (this.companyId != '') {
      this.loadContacts();
    }
  }

  loadContacts(): void {
    this.companyService.getContactPersonsByCompany(this.companyId).subscribe(
        data => this.contacts = data,
        error => console.error('Error fetching contact persons', error)
    );
  }

  toggleNewContactForm() {
    this.showNewContactForm = !this.showNewContactForm;
  }


  saveContact() {
    if (this.newContactForm.valid) {
      const newContact = this.newContactForm.value;
      this.companyService.addContactPerson(newContact, this.companyId).subscribe(
          data => {
            this.contacts.push(data);
            this.resetNewContactForm();
          },
          error => console.error('Error saving new contact', error)
      );
    } else {
      console.log('Formular ist ungültig');
    }
  }



  resetNewContactForm() {
    this.newContactForm.reset();
    this.showNewContactForm = false;
  }

  deleteContact(index: number) {
    const contactPersonId = this.contacts[index].id;
    if (contactPersonId) {
      this.companyService.deleteContactPerson(contactPersonId).subscribe(
          () => this.contacts.splice(index, 1),
          error => console.error('Error deleting contact person', error)
      );
    }
  }

  fillFormWithContact(contact: ContactPerson) {
    this.newContactForm.patchValue(contact);
  }
}
