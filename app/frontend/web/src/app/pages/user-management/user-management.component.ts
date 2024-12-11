import { Component, ChangeDetectorRef, OnChanges, SimpleChanges, HostListener, OnInit } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule
} from '@nebular/theme';
import { NgForOf, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserManagementDialogComponent } from '../../components/dialogs/user-management-dialog/user-management-dialog.component';
import { UserManagementService, DetailedTeamMemberDTO } from '../../services/user-management.service';

// Map DetailedTeamMemberDTO to Member for display
interface Member {
  id: number;
  keycloakId: string;
  name: string; // firstName + lastName
  email: string;
  role: string;
  lastLogin: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NgForOf,
    NgIf,
    NgxPaginationModule,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnChanges {
  headers: string[] = ['ID', 'Anzeigename', 'Email', 'Rolle', 'Letzter Login'];
  searchTerm: string = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  filterMenuVisible: boolean = false;
  selectedMember: Member | null = null;

  members: Member[] = [];
  filteredMembers: Member[] = [];

  constructor(
      private dialogService: NbDialogService,
      private cdRef: ChangeDetectorRef,
      private userService: UserManagementService
  ) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.userService.getTeamMembers().subscribe(teamMembers => {
      this.members = teamMembers.map(dto => this.dtoToMember(dto));
      this.filteredMembers = [...this.members];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['members']) {
      this.applyFilters();
    }
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
      lastLogin: dto.syncedAt,
    };
  }

  get totalMembers(): number {
    return this.filteredMembers.length;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.members];

    if (this.searchTerm) {
      filtered = filtered.filter((member) =>
          Object.values(member).some((value) =>
              value.toString().toLowerCase().includes(this.searchTerm)
          )
      );
    }

    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const valA = a[this.sortColumn as keyof Member]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn as keyof Member]?.toString().toLowerCase() || '';

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredMembers = filtered;
  }

  toggleFilterMenu(): void {
    this.filterMenuVisible = !this.filterMenuVisible;
  }

  toggleDropdown(member: Member): void {
    this.selectedMember = this.selectedMember === member ? null : member;
  }

  openAddMemberDialog() {
    this.dialogService
        .open(UserManagementDialogComponent)
        .onClose.subscribe((selectedMember: Member | null) => {
      if (selectedMember) {
        // Convert Member back to DTO for saving
        const dto = this.memberToDTO(selectedMember);
        this.userService.addTeamMember(dto).subscribe(newDto => {
          const newMember = this.dtoToMember(newDto);
          this.members.push(newMember);
          this.cdRef.detectChanges();
          this.applyFilters();
        });
      }
    });
  }

  editMember(member: Member): void {
    this.dialogService.open(UserManagementDialogComponent)
        .onClose.subscribe((updatedMember: Member | null) => {
      if (updatedMember) {
        // Update on backend
        const dto = this.memberToDTO(updatedMember);
        this.userService.updateTeamMember(updatedMember.id, dto).subscribe(updatedDto => {
          const updated = this.dtoToMember(updatedDto);
          const index = this.members.findIndex(m => m.id === member.id);
          if (index !== -1) {
            this.members[index] = updated;
            this.cdRef.detectChanges();
            this.applyFilters();
          }
        });
      }
    });
  }

  deleteMember(member: Member): void {
    this.userService.deleteTeamMember(member.id).subscribe(() => {
      const index = this.members.findIndex(m => m.id === member.id);
      if (index !== -1) {
        this.members.splice(index, 1);
        this.filteredMembers = [...this.members];
      }
    });
  }

  memberToDTO(member: Member): any {
    // We need to convert Member back to TeamMemberDTO
    // Member does not have all fields (like firstName, lastName), so we might need to store them differently.
    // For simplicity, let's assume we can't perfectly recreate. We'll just guess:
    // We'll parse the name into firstName and lastName if possible.
    const nameParts = member.name.split(' ');
    const firstName = nameParts.length > 0 ? nameParts[0] : undefined;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

    return {
      keycloakId: member.keycloakId,
      username: member.name.replace(' ', '.').toLowerCase(), // or some logic to revert it
      email: member.email,
      firstName: firstName,
      lastName: lastName,
      realmRoles: [member.role],
      note: null
    };
  }

  getColumnKey(index: number): keyof Member {
    const keys: (keyof Member)[] = ['id', 'name', 'email', 'role', 'lastLogin'];

    if (index < 0 || index >= keys.length) {
      throw new Error(`Ungültiger Index: ${index}`);
    }
    return keys[index];
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-menu') && !target.closest('button')) {
      this.filterMenuVisible = false;
    }
  }
}