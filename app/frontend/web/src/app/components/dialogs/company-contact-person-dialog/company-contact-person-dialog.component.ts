import {Component, Inject, Input, OnInit} from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbDialogService,
  NbIconModule,
  NbInputModule,
  NbRadioModule, NbToastrService
} from "@nebular/theme";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CompanyService} from "../../../services/company.service";
import {ContactPerson} from "../../../model/contactperson";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {DialogService} from "primeng/dynamicdialog";

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

  updateContact: boolean = false;
  contactDataId: string | undefined;

  showNewContactForm = false;
  newContactForm: FormGroup = this.fb.group({
    id: [null],
    prefixTitle: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    suffixTitle: [''],
    gender: ['', Validators.required],
    position: ['',Validators.required],
    personalEmail: ['', [Validators.email, Validators.required]],
    personalPhone: ['']
  });

  constructor(private fb: FormBuilder,
              protected ref: NbDialogRef<CompanyContactPersonDialogComponent>,
              private companyService: CompanyService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService)
  {}

  ngOnInit(): void {
    if (this.companyId != '') {
      this.loadContacts();
    }
  }

  close(){
    this.ref.close();
  }

  loadContacts(): void {
    this.companyService.getContactPersonsByCompany(this.companyId).subscribe(
        data => {
          this.contacts = data;
          console.log(this.contacts); // Wird nach Abschluss der asynchronen Anfrage ausgeführt
        },
        error => console.error('Error fetching contact persons', error)
    );
  }

  saveContact() {
    if (this.newContactForm.valid) {
      const newContact = this.newContactForm.value;
      console.log(newContact);

      if(this.updateContact && this.contactDataId) {
        newContact.id = this.contactDataId;
        console.log(newContact);
        this.companyService.updateContactPerson(newContact, this.companyId).subscribe(
            updatedContact => {
              const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
              if (index !== -1) {
                this.contacts[index] = updatedContact;
              }
              this.resetNewContactForm();
              this.loadContacts();
            },
            error => console.error('Error updating contact', error)
        );
        this.updateContact = false;
        this.contactDataId = undefined;
      } else {
        const newContact = this.newContactForm.value;
        this.companyService.addContactPerson(newContact, this.companyId).subscribe(
            data => {
              this.contacts.push(data);
              this.resetNewContactForm();
            },
            error => console.error('Error saving new contact', error)
        );
      }
    } else {
      console.log('Formular ist ungültig');
    }
  }


  resetNewContactForm() {
    this.newContactForm.reset();
    this.showNewContactForm = false;
    this.updateContact = false;
    console.log(this.updateContact);
  }

  deleteContact(index: number, event: Event) {
    event.stopPropagation();
    const contactPersonId = this.contacts[index].id;
    if (contactPersonId) {

      this.dialogService
          .open(ConfirmDialogComponent, {
            context: {
              title: 'Löschen bestätigen',
              message: `Möchten Sie die Kontaktperson "${this.contacts[index].firstName} ${this.contacts[index].lastName}" wirklich löschen?`,
            },
            closeOnBackdropClick: false,
            closeOnEsc: false,
            autoFocus: true,
            hasScroll: false,
          })
          .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.companyService.deleteContactPerson(contactPersonId).subscribe({
            next: () => {
              this.toastrService.success('Kontaktperson erfolgreich gelöscht.', 'Erfolg');
            },
            error: (err: any) => {
              if (err.status === 409) {
                this.toastrService.danger(
                    err.error || 'Kontaktperson kann nicht gelöscht werden, da sie noch in Rechnungen verwendet wird.',
                    'Fehler'
                );
              } else {
                this.toastrService.danger(
                    err.error || 'Fehler beim Löschen der Kontaktperson.',
                    'Fehler'
                );
              }
              console.error(err);
            },

          });
        }
      });
    }
  }

  fillFormWithContact(contact: ContactPerson) {
    this.updateContact = true;
    this.contactDataId = contact.id;
    console.log(this.updateContact);
    this.newContactForm.patchValue(contact);
  }
}
