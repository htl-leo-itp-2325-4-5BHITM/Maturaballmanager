import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Item} from "../../../model/Item";

@Component({
  selector: 'app-sponsorship-invoice-add-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatLabel,
    MatFormField,
    MatDialogContent,
    MatSelect,
    MatOption,
    NgForOf,
    MatCheckbox,
    FormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './sponsorship-invoice-add-dialog.component.html',
  styleUrl: './sponsorship-invoice-add-dialog.component.scss'
})
export class SponsorshipInvoiceAddDialogComponent {
  includeContact = false;
  selectedContact: any;
  contacts = [{ name: 'Max Mustermann', id: 1 }, { name: 'Erika Musterfrau', id: 2 }];
  itemTemplates = [
    { name: 'Template 1', price: 100 },
    { name: 'Template 2', price: 200 }
  ];
  selectedItems: Item[] = [];
  addCustomItems = false;
  customItems: Item[] = [{ name: '', price: 0 }];

  constructor(public dialogRef: MatDialogRef<SponsorshipInvoiceAddDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToReview(): void {
    this.dialogRef.close(this.prepareInvoiceData());
  }

  addNewItem(): void {
    this.customItems.push({ name: '', price: 0 });
  }

  prepareInvoiceData(): any {
    return {
      includeContact: this.includeContact,
      selectedContact: this.selectedContact,
      selectedItems: this.selectedItems.concat(this.customItems.filter(item => item.name && item.price > 0))
    };
  }
}
