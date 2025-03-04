import { Component, OnInit } from '@angular/core';
import {
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule
} from "@nebular/theme";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AppointmentFormComponent } from "../../components/appointment-form/appointment-form.component";
import { AppointmentListComponent } from "../../components/appointment-list/appointment-list.component";
import { AppointmentResponse } from '../../model/appointment';
import { AppointmentService } from '../../services/appointment.service';

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
    NbCheckboxModule,
    AppointmentFormComponent,
    AppointmentListComponent
  ],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  date: Date = new Date();
  eventDate: string = this.date.toISOString().split('T')[0]; // yyyy-MM-dd

  openForm: boolean = false;
  appointments: AppointmentResponse[] = [];

  constructor(
      private appointmentService: AppointmentService,
      private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  onDateChange(newDate: Date) {
    this.date = newDate;
    this.eventDate = newDate.toISOString().split('T')[0];
    this.loadAppointments();
  }

  setOpenForm() {
    this.openForm = true;
  }

  private loadAppointments() {
    this.appointmentService.getAppointmentsForDate(this.eventDate)
        .subscribe({
          next: (appointments) => {
            this.appointments = appointments;
          },
          error: (error) => {
            console.error('Fehler beim Laden der Termine', error);
          }
        });
  }
}