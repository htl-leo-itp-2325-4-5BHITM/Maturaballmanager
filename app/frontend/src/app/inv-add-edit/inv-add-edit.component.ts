import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CompanyService} from "../services/company.service";
import {DialogRef} from "@angular/cdk/dialog";

@Component({
  selector: 'app-inv-add-edit',
  templateUrl: './inv-add-edit.component.html',
  styleUrls: ['./inv-add-edit.component.scss']
})
export class InvAddEditComponent {
  invoiceForm: FormGroup;

  sponsorclasses: string[] = [
    'Bronze',
    'Silber',
    'Gold',
  ]


  constructor(private invForm: FormBuilder, private _invService: CompanyService, private _dialogRef: DialogRef<InvAddEditComponent>) {
    this.invoiceForm = this.invForm.group({
      companyname: '',
      address: '',
      addressnr: '',
      plz: '',
      city: '',
      sponsorpackage: '',
    });
  }

  onFormSubmit() {
    if (this.invoiceForm.valid) {
      // log the form
      console.log(this.invoiceForm.value)
      this._invService.addCompany(this.invoiceForm.value).subscribe({
        next: (val: any) => {
          alert('Invoice added successfully')
          this._dialogRef.close();
        },
        error: (err: any) => {
          console.error(err)
        }
      })
    }
  }
}
