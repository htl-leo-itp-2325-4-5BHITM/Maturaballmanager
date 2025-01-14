import { Component } from '@angular/core';
import {
  NbButtonModule,
  NbCalendarModule,
  NbCardModule, NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule
} from "@nebular/theme";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    NbCardModule,
    NbCalendarModule,
    DatePipe,
    NgForOf,
    NbInputModule,
    NbButtonModule,
    FormsModule,
    NgIf,
    NbFormFieldModule,
    NbIconModule,
    NbCheckboxModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  date: Date = new Date();
  events: { date: Date; startTime: string; endTime: string; title: string }[] = [];

  eventTitle: string = '';
  eventDate: string = this.date.toISOString().split('T')[0]; // Initialwert für Datum
  startTime: string = '';
  endTime: string = '';
  allDay: boolean = false;
  timeError: boolean = false;

  addEvent() {
    this.events.push({ date: this.date, startTime: this.startTime, endTime: this.endTime, title: this.eventTitle });
    this.eventTitle = '';
    this.startTime = '';
    this.endTime = '';
  }

  getEventsForDate(selectedDate: Date) {
    return this.events.filter(
        (event) => new Date(event.date).toDateString() === selectedDate.toDateString()
    );
  }
}
