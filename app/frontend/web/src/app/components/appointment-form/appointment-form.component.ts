import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
} from '@nebular/theme';
import { DetailedTeamMemberDTO, UserManagementService } from '../../services/user-management.service';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentRequest } from '../../model/appointment';

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
        ReactiveFormsModule,
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

    appointmentForm!: FormGroup;
    filteredMembers: Member[] = [];
    selectedMembers: Member[] = [];
    searchQuery: string = '';
    timeError: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserManagementService,
        private appointmentService: AppointmentService,
        private router: Router
    ) {}

    ngOnInit() {
        this.initForm();
        this.updateEventDate();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['date']) {
            this.updateEventDate();
        }
    }

    private initForm() {
        this.appointmentForm = this.fb.group({
            title: ['', Validators.required],
            date: [''],
            allDay: [false],
            startTime: [''],
            endTime: ['']
        });
    }

    private updateEventDate() {
        const localDate = new Date(this.date);
        const formatted = localDate.toLocaleDateString('en-CA');
        this.appointmentForm.get('date')?.setValue(formatted);
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
        if (!this.selectedMembers.some(m => m.id === member.id)) {
            this.selectedMembers.push(member);
        }
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
        const formValue = this.appointmentForm.value;
        if (!formValue.allDay && formValue.startTime && formValue.endTime) {
            if (new Date(`1970-01-01T${formValue.endTime}:00`) < new Date(`1970-01-01T${formValue.startTime}:00`)) {
                this.timeError = true;
                return;
            }
        }
        this.timeError = false;

        const start = formValue.allDay ? null : formValue.startTime;
        const end = formValue.allDay ? null : formValue.endTime;

        const newAppointment: AppointmentRequest = {
            name: formValue.title,
            date: formValue.date,
            startTime: start,
            endTime: end,
            creator: { id: -1 },
            members: this.selectedMembers.map(member => ({ id: member.id }))
        };

        this.appointmentService.createAppointment(newAppointment).subscribe(
            (createdAppointment) => {
                console.log('Termin erfolgreich gespeichert:', createdAppointment);
                this.router.navigate(['/appointments']);
            },
            (error) => {
                console.error('Fehler beim Speichern des Termins:', error);
            }
        );
    }
}