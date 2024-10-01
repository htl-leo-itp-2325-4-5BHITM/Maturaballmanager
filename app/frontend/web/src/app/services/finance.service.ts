import {Injectable, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {AuthStore} from "../stores/auth.store";

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private http: HttpClient) {
  }

  getBalance() {
    return this.http.get<string>('/api/finance/balance');
  }
}
