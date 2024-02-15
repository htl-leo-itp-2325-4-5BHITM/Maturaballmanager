import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {InvAddEditComponent} from "../inv-add-edit/inv-add-edit.component";
import {CompanyService} from "../services/company.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from "@angular/material/table";
import {CompanyOverviewDTO} from "../../model/CompanyOverviewDTO";

@Component({
  selector: 'app-sponsoren',
  templateUrl: './sponsoren.component.html',
  styleUrls: ['./sponsoren.component.scss']
})
export class SponsorenComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'officemail',
    'title'];
  dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _invoiceService: CompanyService) {
  }

  ngOnInit() {
    this.getEmployeeList();
  }

  openAddEditInvoiceForm() {
    this._dialog.open(InvAddEditComponent)
  }

  getEmployeeList() {
    this._invoiceService.getCompanyList().subscribe({
      next: (res) => {
        res.forEach((company: CompanyOverviewDTO) => {
          console.log(company)
        })
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
