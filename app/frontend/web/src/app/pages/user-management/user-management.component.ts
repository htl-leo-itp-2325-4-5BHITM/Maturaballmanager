import { Component, HostListener, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogService, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { NgForOf, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserManagementDialogComponent } from '../../components/dialogs/user-management-dialog/user-management-dialog.component';

interface Member {
  id: string;
  name: string;
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
export class UserManagementComponent implements OnChanges {
  headers: string[] = ['ID', 'Anzeigename', 'Email', 'Rolle', 'Letzter Login'];
  searchTerm: string = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  filterMenuVisible: boolean = false;
  selectedMember: Member | null = null;

  members: Member[] = [
    { id: 'IT200400', name: 'Anna Schmitz', email: 'anna.schmitz@students.htl-leonding.ac.at', role: 'Sponsoring', lastLogin: 'Nov 15, 2025' },
    { id: 'IT200401', name: 'Max Mustermann', email: 'max.mustermann@students.htl-leonding.ac.at', role: 'Marketing', lastLogin: 'Nov 10, 2025' },
    { id: 'IT200402', name: 'John Doe', email: 'john.doe@students.htl-leonding.ac.at', role: 'Verkauf', lastLogin: 'Nov 12, 2025' },
    { id: 'IT200403', name: 'Jane Smith', email: 'jane.smith@students.htl-leonding.ac.at', role: 'Admin', lastLogin: 'Nov 18, 2025' },
    { id: 'IT200404', name: 'Maria Müller', email: 'maria.mueller@students.htl-leonding.ac.at', role: 'Technik', lastLogin: 'Nov 16, 2025' },
    { id: 'IT200405', name: 'Hans Bauer', email: 'hans.bauer@students.htl-leonding.ac.at', role: 'Support', lastLogin: 'Nov 20, 2025' },
    { id: 'IT200406', name: 'Lisa Schulz', email: 'lisa.schulz@students.htl-leonding.ac.at', role: 'Marketing', lastLogin: 'Nov 17, 2025' },
    { id: 'IT200407', name: 'Peter Schmidt', email: 'peter.schmidt@students.htl-leonding.ac.at', role: 'Verkauf', lastLogin: 'Nov 14, 2025' },
  ];

  filteredMembers = [...this.members];

  constructor(private dialogService: NbDialogService, private cdRef: ChangeDetectorRef) {}

  openAddMemberDialog() {
    this.dialogService
        .open(UserManagementDialogComponent)
        .onClose.subscribe((selectedMember: Member | null) => {
      if (selectedMember) {
        console.log(selectedMember);
        this.members.push(selectedMember);
        console.log(this.members);
        this.cdRef.detectChanges(); // Manuelles Triggern der Ansicht-Überprüfung
        this.applyFilters(); // Filter erneut anwenden
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['members']) {
      this.applyFilters();
    }
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

  editMember(member: Member): void {
    console.log('Bearbeiten:', member);
  }

  deleteMember(member: Member): void {
    console.log('Entfernen:', member);
    const index = this.members.findIndex(m => m.id === member.id);
    if (index !== -1) {
      this.members.splice(index, 1);
      this.filteredMembers = [...this.members];
    }
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
