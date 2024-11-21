import {Injectable, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {AuthStore} from "../stores/auth.store";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  baseUrl = `${environment.apiUrl}/finance`;

  constructor(private http: HttpClient) {
  }

  getBalance() {
    return this.http.get<string>(`${this.baseUrl}/balance`);
  }
}
