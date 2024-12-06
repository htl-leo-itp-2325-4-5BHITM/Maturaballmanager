import { Component } from '@angular/core';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

interface MaturaballData {
  motto: string;
  date: string;
  time: string;
  street: string;
  zip: string;
  city: string;
  mainContact: string;
  teacher1: string;
  teacher2: string;
  schedule?: string; // Optional
}

@Component({
  selector: 'app-maturaball',
  standalone: true,
  imports: [
    NbFormFieldModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './maturaball.component.html',
  styleUrl: './maturaball.component.scss'
})

export class MaturaballComponent {

  formData: MaturaballData = {
    motto: '',
    date: '',
    time: '',
    street: '',
    zip: '',
    city: '',
    mainContact: '',
    teacher1: '',
    teacher2: '',
    schedule: ''
  };

  submit(): void {
    const { motto, date, time, street, zip, city, mainContact, teacher1, teacher2 } = this.formData;

    if (!motto || !date || !time || !street || !zip || !city || !mainContact || !teacher1 || !teacher2) {
      alert('Bitte füllen Sie alle Pflichtfelder aus!'); // Fehlernachricht
      return;
    }

    const validData: MaturaballData = {
      ...this.formData,
    };

    console.log('Gespeicherte Maturaball-Daten:', validData);
    alert('Maturaball-Daten wurden erfolgreich gespeichert!');
  }

  closeEvent(): void {
    console.log('Das Formular wurde geschlossen.');
  }
}
