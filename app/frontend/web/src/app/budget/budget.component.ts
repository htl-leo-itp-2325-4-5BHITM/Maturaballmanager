import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {DecimalPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {BudgetService} from "../services/budget.service";
import {BudgetDialogComponent} from "../budget-dialog/budget-dialog.component";

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCardContent,
    MatCard,
    DecimalPipe,
    MatButton
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss'
})
export class BudgetComponent {
  initialBudget: number = 0
  income: number = 0
  expenses: number = 0
  goal: number = 10000

  constructor(private budgetService: BudgetService, public dialog: MatDialog) {
  }

  openDialog(type: string): void {
    const dialogRef = this.dialog.open(BudgetDialogComponent, {
      width: '250px',
      data: {type: type}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'income') {
          this.budgetService.addIncome(result)
        } else if (type === 'expense') {
          this.budgetService.addExpenses(result)
        }
      }
    })
  }

  getCurrentBudget(): number {
    return this.budgetService.getCurrentBudget()
  }


  getProfit(): number {
    return this.budgetService.getProfit()
  }
}








