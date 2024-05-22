import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiUrl} from "../app.config";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  getEarnedSponsorshipMoney(): Observable<number> {
    return this.http.get<number>(`${apiUrl}/finance/sponsorship/total`);
  }
}
