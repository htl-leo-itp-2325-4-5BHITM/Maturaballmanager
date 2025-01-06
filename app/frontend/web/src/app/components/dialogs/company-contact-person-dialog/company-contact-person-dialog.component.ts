import {Component, OnInit} from '@angular/core';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule} from "@nebular/theme";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-company-contact-person-dialog',
  standalone: true,
  imports: [
    NbCardModule,
    NbIconModule,
    NgIf,
    NgForOf,
    NbButtonModule,
    NbInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-contact-person-dialog.component.html',
  styleUrl: './company-contact-person-dialog.component.scss'
})
export class CompanyContactPersonDialogComponent implements OnInit {

  contacts = [
    {
      prefixTitle: 'Dr.',
      firstName: 'Max',
      lastName: 'Mustermann',
      position: 'CEO',
      personalEmail: 'max.mustermann@example.com',
      personalPhone: '+49 123 456789'
    },
    {
      prefixTitle: 'Prof.',
      firstName: 'Maria',
      lastName: 'Schmidt',
      position: 'CTO',
      personalEmail: 'maria.schmidt@example.com',
      personalPhone: '+49 987 654321'
    }
  ];

  // Formularsteuerung
  showNewContactForm = false;
  newContactForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initialisierung des Formulars für neue Kontakte
    this.newContactForm = this.fb.group({
      prefixTitle: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: [''],
      personalEmail: ['', [Validators.email]],
      personalPhone: ['']
    });
  }

  // Formular anzeigen oder verbergen
  toggleNewContactForm() {
    this.showNewContactForm = !this.showNewContactForm;
  }

  // Neuen Kontakt speichern
  saveContact() {
    if (this.newContactForm.valid) {
      const newContact = this.newContactForm.value;
      this.contacts.push(newContact);
      this.resetNewContactForm();
    } else {
      console.log('Formular ist ungültig');
    }
  }

  resetNewContactForm() {
    this.newContactForm.reset();
    this.showNewContactForm = false;
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
  }
}
