import {
  Component,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
} from '@nebular/theme';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserManagementDialogComponent } from '../../components/dialogs/user-management-dialog/user-management-dialog.component';
import { UserManagementService, DetailedTeamMemberDTO } from '../../services/user-management.service';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';

/**
 * Member-Interface: mehrere Rollen sind möglich (roles: string[]).
 */
interface Member {
  id: number;
  keycloakId: string;
  name: string;
  email: string;
  roles: string[];
  lastLogin: string;
}

/**
 * Mapping: interne Rollennamen -> Anzeigenamen/Labels
 * Ergänze hier bei Bedarf weitere Rollen.
 */
const ROLE_LABELS: Record<string, string> = {
  management: 'Maturaballleitung',
  finance: 'Finanzen',
  sponsoring: 'Sponsoring',
  organization: 'Organisation',
};

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
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
  headers: string[] = ['ID', 'Anzeigename', 'Email', 'Rollen', 'Letzter Login'];
  searchTerm: string = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  filterMenuVisible: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['members']) {
      this.applyFilters();
    }
  }

  /**
   * Lädt sämtliche Team-Mitglieder aus dem Backend.
   */
  loadMembers() {
    this.userService.getTeamMembers().subscribe({
      next: (teamMembers) => {
        this.members = teamMembers.map((dto) => this.dtoToMember(dto));
        this.filteredMembers = [...this.members];
      },
      error: (err) => {
        console.error('Fehler beim Laden der Team-Members:', err);
      },
    });
  }

  /**
   * Wandelt DetailedTeamMemberDTO -> Member um.
   */
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

  /**
   * Filtert & sortiert die Liste nach Suchbegriff / Sortierspalte.
   */
  applyFilters(): void {
    let filtered = [...this.members];

    if (this.searchTerm) {
      const term = this.searchTerm;
      filtered = filtered.filter((m) =>
          Object.values(m).some((value) =>
              value.toString().toLowerCase().includes(term)
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

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-menu') && !target.closest('button')) {
      this.filterMenuVisible = false;
    }
  }

  /**
   * Öffnet den Dialog zum Anlegen eines neuen Benutzers.
   */
  openAddMemberDialog() {
    this.dialogService
        .open(UserManagementDialogComponent)
        .onClose.subscribe((selectedMember: Member | null) => {
      if (selectedMember) {
        const dto = this.memberToDTO(selectedMember);

        this.userService.addTeamMember(dto).subscribe({
          next: (newDto) => {
            this.loadMembers(); // Aktualisiere Liste aus dem Backend
            const newMember = this.dtoToMember(newDto);
            this.members.push(newMember);
            this.cdRef.detectChanges();
            this.applyFilters();
          },
          error: (err) => console.error('Fehler beim Anlegen:', err),
        });
      }
    });
  }

  /**
   * Öffnet den Dialog zum Bearbeiten eines vorhandenen Benutzers.
   */
  editMember(member: Member): void {
    this.dialogService
        .open(UserManagementDialogComponent, {
          autoFocus: false,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: { member, isEditing: true },
        })
        .onClose.subscribe((updatedMember: Member | null) => {
      if (updatedMember) {
        const dto = this.memberToDTO(updatedMember);
        this.userService.updateTeamMember(updatedMember.id, dto).subscribe({
          next: (updatedDto) => {
            const updated = this.dtoToMember(updatedDto);
            const index = this.members.findIndex((m) => m.id === member.id);
            if (index !== -1) {
              this.members[index] = updated;
              this.cdRef.detectChanges();
              this.applyFilters();
            }
          },
          error: (err) => console.error('Fehler beim Updaten:', err),
        });
      }
    });
  }

  /**
   * Confirmation Dialog -> Löschen des Benutzers
   */
  deleteMember(event: MouseEvent, member: Member): void {
    event.stopPropagation();

    this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            title: 'Mitglied löschen?',
            message: `Möchten Sie ${member.name} wirklich löschen?`,
          },
        })
        .onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.deleteTeamMember(member.id).subscribe({
          next: () => {
            const index = this.members.findIndex((m) => m.id === member.id);
            if (index !== -1) {
              this.members.splice(index, 1);
              this.filteredMembers = [...this.members];
            }
          },
          error: (err) => console.error('Fehler beim Löschen:', err),
        });
      }
    });
  }

  /**
   * Baut das DTO, das ans Backend geschickt werden soll.
   * Setzt realmRoles = member.roles
   */
  memberToDTO(member: Member): any {
    const nameParts = member.name.split(' ');
    const firstName = nameParts.length > 0 ? nameParts[0] : '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    return {
      keycloakId: member.keycloakId,
      username: member.name.replace(' ', '.').toLowerCase(),
      email: member.email,
      firstName: firstName,
      lastName: lastName,
      realmRoles: member.roles, // mehrere Rollen!
      note: null,
    };
  }

  /**
   * Übersetzt die internen Rollennamen in Labels, kommasepariert.
   * Wird im Template aufgerufen.
   */
  getRolesAsLabel(roles: string[]): string {
    if (!roles || roles.length === 0) {
      return 'Keine Rollen';
    }
    return roles.map((r) => ROLE_LABELS[r] ?? r).join(', ');
  }

  getColumnKey(i: number) {
    return this.headers[i].toLowerCase().replace(' ', '_');
  }
}
