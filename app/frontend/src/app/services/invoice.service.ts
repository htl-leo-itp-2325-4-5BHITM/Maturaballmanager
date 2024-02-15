import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private _http: HttpClient) {
  }

  addInvoice(data: any): Observable<any> {
    return this._http.post('http://localhost:9999/api/invoice/add', data)
  }

  getInvoiceList(): Observable<any> {
    return this._http.get('http://localhost:9999/api/invoice/add')
  }
}
