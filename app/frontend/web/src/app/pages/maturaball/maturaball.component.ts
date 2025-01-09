import {Component, OnInit} from '@angular/core';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PromService} from "../../services/prom.service";
import {DayPlanDTO, PromDTO} from "../../model/dtos/prom.dto";
import {NgForOf, NgIf} from "@angular/common";

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
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './maturaball.component.html',
  styleUrl: './maturaball.component.scss'
})
export class MaturaballComponent implements OnInit {

  formData: PromDTO = {
    motto: '',
    date: '',
    time: '',
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    dayPlan: []
  };

  editingExistingProm = false;
  activePromId: string | null = null;

  constructor(private promService: PromService) {}

  async ngOnInit(): Promise<void> {
    try {
      const activeProm: any = await this.promService.getActiveProm();
      if (activeProm && activeProm.id) {
        this.editingExistingProm = true;
        this.activePromId = activeProm.id;

        this.formData.motto = activeProm.name;
        this.formData.date = activeProm.date;
        this.formData.time = activeProm.time;
        this.formData.street = activeProm.address.street;
        this.formData.houseNumber = activeProm.address.houseNumber;
        this.formData.zip = activeProm.address.postalCode;
        this.formData.city = activeProm.address.city;

        if (activeProm.dayPlan) {
          this.formData.dayPlan = activeProm.dayPlan.map((entry: DayPlanDTO) => {
            if (entry) {
              return { name: entry.name, time: entry.time };
            }
            return { name: '', time: '' };
          }).filter((entry: DayPlanDTO) => entry.name || entry.time); // Filtere leere Einträge
        }

      } else {
        this.editingExistingProm = false;
        this.activePromId = null;
        this.formData.dayPlan = []; // Stelle sicher, dass dayPlan leer bleibt
      }
    } catch (err) {
      console.error('Fehler beim Laden des aktiven Maturaballs', err);
      this.editingExistingProm = false;
    }
  }

  addDayPlanEntry(): void {
    this.formData.dayPlan.push({ name: '', time: '' });
  }

  removeDayPlanEntry(index: number): void {
    this.formData.dayPlan.splice(index, 1);
  }

  async submit(): Promise<void> {
    const { motto, date, time, street, houseNumber, zip, city } = this.formData;

    if (!motto || !date || !time || !street || !houseNumber || !zip || !city) {
      alert('Bitte füllen Sie alle Pflichtfelder aus!');
      return;
    }
    console.log(this.formData)

    try {
      let response;
      if ( this.activePromId) {
        // Vorhandenen Maturaball updaten
        this.formData.dayPlan = this.formData.dayPlan.filter((entry: any) => entry.name && entry.time);
        response = await this.promService.updateProm(this.activePromId, this.formData);
      } else {
        // Neuen Maturaball erstellen
        response = await this.promService.createProm(this.formData);
      }
      console.log('Gespeicherte Maturaball-Daten:', response);
      alert('Maturaball-Daten wurden erfolgreich gespeichert!');
    } catch (err) {
      console.error('Fehler beim Speichern der Maturaball-Daten:', err);
      alert('Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.');
    }
  }

  async closeEvent(): Promise<void> {
    if (this.activePromId) {
      try {
        await this.promService.deactivateProm(this.activePromId);
        alert('Der aktuelle Maturaball wurde geschlossen. Nun kann ein neuer erstellt werden.');
        // Nach dem Schließen die Felder zurücksetzen
        this.editingExistingProm = false;
        this.activePromId = null;
        this.formData = {
          motto: '',
          date: '',
          time: '',
          street: '',
          houseNumber: '',
          zip: '',
          city: '',
          dayPlan: []
        };
      } catch (err) {
        console.error('Fehler beim Schließen des Maturaballs:', err);
        alert('Fehler beim Schließen. Bitte versuchen Sie es erneut.');
      }
    } else {
      console.log('Kein aktiver Maturaball zum Schließen vorhanden.');
    }
  }
}