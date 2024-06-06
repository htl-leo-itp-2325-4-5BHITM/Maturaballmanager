import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private initialBudget: number = 0
  private income: number = 0
  private expenses: number = 0

  constructor() { }

  setInitialBudget(amount: number) {
    this.initialBudget = amount
  }

  addIncome(amount: number) {
    this.income += amount
  }

  addExpenses(amount: number) {
    this.expenses += amount
  }

  getCurrentBudget(): number {
    return this.initialBudget + this.income - this.expenses
  }

  getProfit(): number {
    return this.income - this.expenses
  }
}
