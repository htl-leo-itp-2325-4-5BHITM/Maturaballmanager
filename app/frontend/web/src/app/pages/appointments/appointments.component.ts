import { Component } from '@angular/core';
import {
  NbButtonModule,
  NbCalendarModule,
  NbCardModule, NbCheckboxModule, NbDialogRef, NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule
} from "@nebular/theme";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AppointmentFormComponent} from "../../components/appointment-form/appointment-form.component";
import {
  UserManagementDialogComponent
} from "../../components/dialogs/user-management-dialog/user-management-dialog.component";
import {UserManagementService} from "../../services/user-management.service";
import {AppointmentListComponent} from "../../components/appointment-list/appointment-list.component";

interface Member {
  id: number;
  keycloakId: string;
  name: string;
  email: string;
  roles: string[];
  lastLogin: string;
}


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
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  date: Date = new Date();

  eventTitle: string = '';
  eventDate: string = this.date.toISOString().split('T')[0]; // Initialwert für Datum
  startTime: string = '';
  endTime: string = '';
  allDay: boolean = false;
  filteredMembers: Member[] = [];

  timeError: boolean = false;
  openForm: boolean = false;

  constructor(
      private dialogService: NbDialogService,
  ) {}

  setOpenForm(){
    this.openForm = true;
  }

  addEvent() {
    this.eventTitle = '';
    this.startTime = '';
    this.endTime = '';
  }

  onDateChange(newDate: Date) {
    this.date = newDate;
    this.eventDate = newDate.toISOString().split('T')[0];
    console.log(this.date);
  }

  protected readonly open = open;
}
