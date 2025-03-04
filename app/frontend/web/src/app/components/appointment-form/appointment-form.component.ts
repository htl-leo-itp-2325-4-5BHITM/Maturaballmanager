import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
} from '@nebular/theme';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentRequest } from '../../model/appointment';
import { UserManagementService, DetailedTeamMemberDTO } from '../../services/user-management.service';

interface Member {
    id: number;
    keycloakId: string;
    name: string;
    email: string;
    roles: string[];
    lastLogin: string;
}

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    imports: [
        DatePipe,
        FormsModule,
        NbButtonModule,
        NbCardModule,
        NbFormFieldModule,
        NbIconModule,
        NbInputModule,
        NgForOf,
        NgIf,
    ],
    styleUrls: ['./appointment-form.component.scss'],
    templateUrl: './appointment-form.component.html',
})
export class AppointmentFormComponent implements OnInit, OnChanges {
    @Input() date: Date = new Date();

    eventTitle: string = '';
    eventDate: string = '';
    startTime: string = '';
    endTime: string = '';
    allDay: boolean = false;
    filteredMembers: Member[] = [];
    selectedMembers: Member[] = [];

    searchQuery: string = '';
    timeError: boolean = false; // Neu hinzugefügt, um den Fehler im Template zu beheben

    constructor(
        private userService: UserManagementService,
        private appointmentService: AppointmentService
    ) {}

    ngOnInit() {
        this.updateEventDate();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['date']) {
            this.updateEventDate();
        }
    }

    private updateEventDate() {
        const localDate = new Date(this.date);
        // Format yyyy-MM-dd (z. B. "2025-03-04")
        this.eventDate = localDate.toLocaleDateString('en-CA');
    }

    filterMembers(query: string) {
        if (query.length >= 3) {
            this.userService.searchTeamMembers(query).subscribe((dtos) => {
                this.filteredMembers = dtos.map((dto) => this.dtoToMember(dto));
            });
        } else {
            this.filteredMembers = [];
        }
    }

    onSelect(member: Member) {
        this.selectedMembers.push(member);
        this.searchQuery = '';
        this.filteredMembers = [];
    }

    dtoToMember(dto: DetailedTeamMemberDTO): Member {
        const fullName = [dto.firstName, dto.lastName].filter(Boolean).join(' ');
        const roles = dto.realmRoles ?? [];
        return {
            id: dto.id,
            keycloakId: dto.keycloakId,
            name: fullName || dto.username,
            email: dto.email,
            roles,
            lastLogin: dto.syncedAt,
        };
    }

    removeMember(member: Member) {
        const index = this.selectedMembers.indexOf(member);
        if (index !== -1) {
            this.selectedMembers.splice(index, 1);
        }
    }

    addEvent() {
        if (!this.allDay && this.startTime && this.endTime && this.startTime >= this.endTime) {
            this.timeError = true;
            return;
        }
        this.timeError = false;

        const appointment: AppointmentRequest = {
            name: this.eventTitle,
            date: this.eventDate, // Format: yyyy-MM-dd
            startTime: this.allDay ? undefined : this.startTime,
            endTime: this.allDay ? undefined : this.endTime,
            creatorId: 123,
            memberIds: this.selectedMembers.map(member => member.id)
        };

        this.appointmentService.createAppointment(appointment).subscribe({
            next: (response) => {
                console.log('Termin erstellt:', response);
                // Optional: Formular zurücksetzen oder Liste aktualisieren
            },
            error: (error) => {
                console.error('Fehler beim Erstellen des Termins', error);
            }
        });
    }
}