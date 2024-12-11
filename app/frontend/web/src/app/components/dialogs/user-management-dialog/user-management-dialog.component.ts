import { Component, Inject } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbInputModule, NbRadioModule, NB_DIALOG_CONFIG, NbDialogConfig } from '@nebular/theme';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DetailedTeamMemberDTO, UserManagementService} from "../../../services/user-management.service";

interface Member {
  id: number;
  keycloakId: string;
  name: string;
  email: string;
  role?: string;
  lastLogin?: string;
}

@Component({
  selector: 'app-user-management-dialog',
  standalone: true,
  imports: [
    NbInputModule,
    NgIf,
    NgForOf,
    FormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbRadioModule
  ],
  templateUrl: './user-management-dialog.component.html',
  styleUrls: ['./user-management-dialog.component.scss']
})
export class UserManagementDialogComponent {
  roles = [
    { value: 'management', label: 'Maturaballleitung', checked: true },
    { value: 'finance', label: 'Finanzen' },
    { value: 'sponsoring', label: 'Sponsoring' },
  ];

  filteredMembers: Member[] = [];
  searchQuery: string = '';
  selectedMember: Member | null = null;
  role: string | null = null;
  isEditing: boolean = false;

  constructor(
      protected dialogRef: NbDialogRef<UserManagementDialogComponent>,
      @Inject(NB_DIALOG_CONFIG) public config: NbDialogConfig<{ member?: Member }>,
      private userService: UserManagementService
  ) {
    if (config.context?.member) {
      this.isEditing = true;
      this.selectedMember = { ...config.context.member };
      this.role = this.selectedMember.role ?? 'Marketing';
    } else {
      this.role = 'Marketing';
    }
  }

  filterMembers(query: string) {
    if (query.length >= 3) {
      this.userService.searchTeamMembers(query).subscribe(dtos => {
        this.filteredMembers = dtos.map(dto => this.dtoToMember(dto));
      });
    } else {
      this.filteredMembers = [];
    }
  }

  onSelect(member: Member) {
    this.selectedMember = member;
    this.searchQuery = member.name;
    this.filteredMembers = [];
  }

  dtoToMember(dto: DetailedTeamMemberDTO): Member {
    const fullName = [dto.firstName, dto.lastName].filter(Boolean).join(' ');
    const role = dto.realmRoles && dto.realmRoles.length > 0 ? dto.realmRoles[0] : 'N/A';
    return {
      id: dto.id,
      keycloakId: dto.keycloakId,
      name: fullName || dto.username,
      email: dto.email,
      role: role,
      lastLogin: dto.syncedAt
    };
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (!this.selectedMember && !this.isEditing) return;
    const updatedMember = {
      ...this.selectedMember,
      role: this.role,
      lastLogin: new Date().toLocaleDateString('en-GB')
    };
    this.dialogRef.close(updatedMember);
  }
}