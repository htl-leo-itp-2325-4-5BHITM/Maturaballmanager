import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
} from '@nebular/theme';
import { DetailedTeamMemberDTO, UserManagementService } from '../../services/user-management.service';

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
        NgIf,
        NgForOf,
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
    selectedMembers: Member[] = []; // Hier speichern wir die ausgewählten Mitglieder

    timeError: boolean = false;
    searchQuery: string = '';

    constructor(private userService: UserManagementService) {}

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
        this.selectedMembers.push(member); // Füge das Mitglied zu den ausgewählten Mitgliedern hinzu
        this.searchQuery = ''; // Leere das Suchfeld nach Auswahl
        this.filteredMembers = []; // Leere die Filterergebnisse
        console.log(this.selectedMembers);
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
        // Entferne das Mitglied aus der Liste der ausgewählten Mitglieder
        const index = this.selectedMembers.indexOf(member);
        if (index !== -1) {
            this.selectedMembers.splice(index, 1);
        }
    }

    addEvent() {
        // Logik zum Speichern des Termins
    }
}
