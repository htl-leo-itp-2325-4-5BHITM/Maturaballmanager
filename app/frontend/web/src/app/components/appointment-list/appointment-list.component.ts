import { Component, Input, OnInit } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { NbAccordionModule, NbCardModule } from "@nebular/theme";

interface Member {
  id: number;
  keycloakId: string;
  name: string;
  email: string;
  roles: string[];
  lastLogin: string;
}

interface Appointment {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  filteredMembers: Member[];
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
export class AppointmentListComponent implements OnInit {
  @Input() date!: Date;

  members: Member[] = [
    {
      id: 1,
      keycloakId: 'user1',
      name: 'Max Mustermann',
      email: 'max.mustermann@example.com',
      roles: ['Admin', 'Manager'],
      lastLogin: '2025-02-25T10:30:00Z'
    },
    {
      id: 2,
      keycloakId: 'user2',
      name: 'Erika Mustermann',
      email: 'erika.mustermann@example.com',
      roles: ['User'],
      lastLogin: '2025-02-24T14:00:00Z'
    },
    {
      id: 3,
      keycloakId: 'user3',
      name: 'John Doe',
      email: 'john.doe@example.com',
      roles: ['User', 'Manager'],
      lastLogin: '2025-02-26T08:00:00Z'
    },
    {
      id: 4,
      keycloakId: 'user4',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      roles: ['Admin'],
      lastLogin: '2025-02-27T09:45:00Z'
    }
  ];

  // Beispiel Termine
  terminListe: Appointment[] = [
    {
      title: 'Team Meeting',
      date: '2025-02-27',
      startTime: '09:00',
      endTime: '10:00',
      allDay: false,
      filteredMembers: []
    },
    {
      title: 'Project Presentation',
      date: '2025-02-12',
      startTime: '14:00',
      endTime: '15:00',
      allDay: false,
      filteredMembers: [this.members[2], this.members[3]]
    },
    {
      title: 'All Day Workshop',
      date: '2025-03-15',
      startTime: '',
      endTime: '',
      allDay: true,
      filteredMembers: [this.members[0], this.members[2]]
    }
  ];

  filteredAppointments: Appointment[] = [];

  ngOnInit() {
    // Beim Initialisieren wird die Liste der Termine nach dem Datum gefiltert
    this.filterAppointmentsByDate();
  }

  ngOnChanges() {
    // Wenn sich das Datum ändert, filtere die Termine neu
    this.filterAppointmentsByDate();
  }

  private filterAppointmentsByDate() {
    const localDate = new Date(this.date);
    const selectedDate = localDate.toLocaleDateString('en-CA');
    this.filteredAppointments = this.terminListe.filter(appointment => appointment.date === selectedDate);
  }
}
