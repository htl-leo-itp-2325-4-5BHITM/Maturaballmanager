import { Component, Input, OnInit } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbIconModule,
  NbInputModule,
  NbSelectModule
} from '@nebular/theme';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedTeamMemberDTO, UserManagementService } from '../../../services/user-management.service';

/**
 * Member-Interface lokal für den Dialog (ggf. identisch zu dem in user-management.component.ts).
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
 * Rollenauswahl
 */
interface RoleOption {
  value: string; // z. B. "management"
  label: string; // z. B. "Maturaballleitung"
}

@Component({
  selector: 'app-user-management-dialog',
  standalone: true,
  imports: [
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NgIf,
    NgForOf,
    FormsModule,
    NgStyle,
  ],
  templateUrl: './user-management-dialog.component.html',
  styleUrls: ['./user-management-dialog.component.scss'],
})
export class UserManagementDialogComponent implements OnInit {
  /** Liste aller möglichen Rollen */
  roles: RoleOption[] = [
    { value: 'management', label: 'Maturaballleitung' },
    { value: 'sponsoring', label: 'Sponsoring' },
    // ggf. erweitern ...
  ];

  /** Falls wir bereits ein Member zum Bearbeiten haben */
  @Input() member: Member | null = null;
  @Input() isEditing: boolean = false;

  /** Der Suchbegriff (nur beim Anlegen nötig, ggf. weglassen) */
  searchQuery: string = '';

  /** Die Rollen, die ausgewählt werden (Mehrfachauswahl) */
  selectedRoles: string[] = [];

  /** Gefundene Mitglieder (falls du via Keycloak suchst) */
  filteredMembers: Member[] = [];

  constructor(
      protected dialogRef: NbDialogRef<UserManagementDialogComponent>,
      private userService: UserManagementService
  ) {}

  ngOnInit(): void {
    // Falls wir bearbeiten, befüllen wir die Rolle-Auswahl:
    if (this.isEditing && this.member) {
      // Kopie, um das Original nicht zu überschreiben
      this.selectedRoles = [...this.member.roles];
    }
  }

  /**
   * Filtert ggf. User (wenn du einen Such-Endpoint hast).
   */
  filterMembers(query: string) {
    if (query.length >= 3) {
      this.userService.searchTeamMembers(query).subscribe(dtos => {
        this.filteredMembers = dtos.map((dto) => this.dtoToMember(dto));
      });
    } else {
      this.filteredMembers = [];
    }
  }

  onSelect(member: Member) {
    this.member = member;
    this.searchQuery = member.name;
    this.filteredMembers = [];
  }

  /**
   * Klick auf "Abbrechen"
   */
  cancel() {
    this.dialogRef.close(null);
  }

  /**
   * Klick auf "Speichern/Aktualisieren"
   */
  submit() {
    if (!this.member && !this.isEditing) {
      // Keine Auswahl getroffen, Dialog einfach schließen
      return;
    }

    // Wenn wir neu anlegen:
    if (!this.member) {
      // z. B. du hast jemanden aus der Suche ausgewählt.
      // Falls in deinem Flow der "Suche" optional ist, müsstest du hier
      // nochmal differenzieren.
      return;
    }

    // Aktualisierte Daten:
    const updatedMember: Member = {
      ...this.member,
      roles: [...this.selectedRoles],
      lastLogin: new Date().toISOString(),
    };

    this.dialogRef.close(updatedMember);
  }

  /**
   * Falls du DetailedTeamMemberDTO aus der Suche bekommst, in dein lokales Member-Format konvertieren.
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
}
