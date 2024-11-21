import { Component } from '@angular/core';
import {NbCardModule} from "@nebular/theme";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-management-dialog',
  standalone: true,
  imports: [
    NbCardModule,
    FormsModule
  ],
  templateUrl: './user-management-dialog.component.html',
  styleUrl: './user-management-dialog.component.scss'
})
export class UserManagementDialogComponent {
  newMember = {
    name: '',
    email: '',
    role: '',
  };

  constructor() {}

  onSubmit() {
    // Füge das neue Mitglied hinzu
    console.log('Neues Mitglied:', this.newMember);
  }

  close() {
    // Schließe den Dialog
  }
}
