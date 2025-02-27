import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NbAccordionModule, NbCardModule } from '@nebular/theme';
import {AppointmentService} from "../../services/appointment.service";
import {AppointmentRequest, AppointmentResponse} from "../../model/appointment";

interface Member {
  id: number;
  keycloakId: string;
  name: string;
  email: string;
  roles: string[];
  lastLogin: string;
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NbCardModule,
    NbAccordionModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, OnChanges {
  @Input() date!: Date;

  appointmentList: AppointmentResponse[] = [];

  filteredAppointments: AppointmentResponse[] = [];

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.filterAppointmentsByDate();
    this.appointmentService.getAppointments().subscribe(appointments => {
        this.appointmentList = appointments;
        this.filterAppointmentsByDate();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date']) {
      this.filterAppointmentsByDate();
    }
  }

  private filterAppointmentsByDate() {
    const localDate = new Date(this.date);
    const selectedDate = localDate.toLocaleDateString('en-CA');
    this.filteredAppointments = this.appointmentList.filter(appointment => appointment.date === selectedDate);
  }
}
