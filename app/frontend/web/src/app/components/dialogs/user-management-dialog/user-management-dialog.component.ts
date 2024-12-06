import { Component } from '@angular/core';
import {NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbInputModule, NbRadioModule} from '@nebular/theme';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {updateSeriesElementSelection} from "echarts/types/src/util/states";

interface Member {
  id: string;
  name: string;
  email: string;
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
    { value: 'Marketing', label: 'Marketing', checked: true },
    { value: 'Sponsoring', label: 'Sponsoring' },
    { value: 'Admin', label: 'Admin' },
  ];

  members: Member[] = [
    { id: 'IT300001', name: 'Sophia Bergmann', email: 'sophia.bergmann@students.htl-leonding.ac.at' },
    { id: 'IT300002', name: 'Lucas Huber', email: 'lucas.huber@students.htl-leonding.ac.at' },
    { id: 'IT300003', name: 'Emma Fischer', email: 'emma.fischer@students.htl-leonding.ac.at' },
    { id: 'IT300004', name: 'Noah Keller', email: 'noah.keller@students.htl-leonding.ac.at' },
    { id: 'IT300005', name: 'Mia Weber', email: 'mia.weber@students.htl-leonding.ac.at' },
    { id: 'IT300006', name: 'Elias Wagner', email: 'elias.wagner@students.htl-leonding.ac.at' },
    { id: 'IT300007', name: 'Lina Scholz', email: 'lina.scholz@students.htl-leonding.ac.at' },
    { id: 'IT300008', name: 'Ben Frank', email: 'ben.frank@students.htl-leonding.ac.at' }
  ];

  filteredMembers: Member[] = [];
  searchQuery: string = '';
  selectedMember: Member | null = null;
  role: string | null = null;

  constructor(protected dialogRef: NbDialogRef<UserManagementDialogComponent>) {}

  filterMembers(query: string) {
    if (query.length >= 3) {
      this.filteredMembers = this.members.filter(member =>
          member.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredMembers = [];
    }
  }

  onSelect(member: Member) {
    this.selectedMember = member;
    this.searchQuery = member.name;
    this.filteredMembers = [];
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
      /*if (this.selectedMember) {
        const updatedMember = {
          ...this.selectedMember,
          role: this.role,
          lastLogin: new Date().toLocaleDateString('en-GB')
        };
        this.dialogRef.close(updatedMember);
      }*/
    const updatedMember = {
      ...this.selectedMember,
      role: this.role,
      lastLogin: new Date().toLocaleDateString('en-GB')
    };
    this.dialogRef.close(updatedMember);
  }
}
