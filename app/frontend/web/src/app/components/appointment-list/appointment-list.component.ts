import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NbCardModule, NbAccordionModule } from '@nebular/theme';
import { AppointmentResponse } from '../../model/appointment';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [NgForOf, NgIf, NbCardModule, NbAccordionModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, OnChanges {
  @Input() appointments: AppointmentResponse[] = [];
  @Input() date!: Date;

  filteredAppointments: AppointmentResponse[] = [];

  ngOnInit() {
    this.filterAppointments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appointments'] || changes['date']) {
      this.filterAppointments();
    }
  }

  private filterAppointments() {
    if (!this.appointments || !this.date) {
      this.filteredAppointments = [];
      return;
    }
    const selectedDateStr = this.getDateString(this.date);
    this.filteredAppointments = this.appointments.filter(appointment => appointment.date === selectedDateStr);
  }

  private getDateString(date: Date): string {
    // Format yyyy-MM-dd
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}