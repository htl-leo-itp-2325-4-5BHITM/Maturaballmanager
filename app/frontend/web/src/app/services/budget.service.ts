import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }

  getGoal(): Observable<number> {
    return this.http.get<number>('http://localhost:9999/budget/goal');
  }

  setGoal(goal: number): Observable<void> {
    return this.http.post<void>('http://localhost:9999/budget/goal', goal);
  }

  getIncome(): Observable<number> {
    return this.http.get<number>('http://localhost:9999/budget/income');
  }

  addIncome(amount: number): Observable<void> {
    return this.http.post<void>('http://localhost:9999/budget/income', amount);
  }

  getExpenses(): Observable<number> {
    return this.http.get<number>('http://localhost:9999/budget/expenses');
  }

  addExpense(amount: number): Observable<void> {
    return this.http.post<void>('http://localhost:9999/budget/expenses', amount);
  }

  getProfit(): Observable<number> {
    return this.http.get<number>('http://localhost:9999/budget/profit');
  }
}
