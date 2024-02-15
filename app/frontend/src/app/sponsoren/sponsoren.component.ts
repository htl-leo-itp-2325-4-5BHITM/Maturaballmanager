import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {InvAddEditComponent} from "../inv-add-edit/inv-add-edit.component";
import {InvoiceService} from "../services/invoice.service";
import {HttpClient} from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-sponsoren',
  templateUrl: './sponsoren.component.html',
  styleUrls: ['./sponsoren.component.scss']
})
export class SponsorenComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'address',
    'addressnr',
    'title'];
  dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _invoiceService: InvoiceService) {
  }

  ngOnInit() {
    this.getEmployeeList();
  }

  openAddEditInvoiceForm() {
    this._dialog.open(InvAddEditComponent)
  }

  getEmployeeList() {
    this._invoiceService.getInvoiceList().subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
