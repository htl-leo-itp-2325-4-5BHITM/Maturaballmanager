import {Component, OnInit} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {BudgetService} from "../services/budget.service";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    MatProgressBar,
    MatHeaderRow,
    MatButton,
    MatHeaderCell,
    MatColumnDef,
    MatTable,
    MatCell,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCard
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss'
})
export class BudgetComponent implements OnInit {
  goal: number = 0;
  profit: number = 0;
  goalProgress: number = 0;

  incomeData = [
    { company: 'MIC GmbH', amount: 300.0 },
    { company: 'CountIT', amount: 800.0 },
    { company: 'Avocodo', amount: 900.0 }
  ];

  expenseData = [
    { description: 'Catering', amount: -500.0 },
    { description: 'Dekoration', amount: -200.0 },
    { description: 'DJ', amount: -150.0 }
  ];

  displayedColumns: string[] = ['company', 'amount'];
  displayedColumnsExpenses: string[] = ['description', 'amount', 'upload'];

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.budgetService.getGoal().subscribe(goal => {
      this.goal = goal;
      this.updateProgress();
    }, error => {
      console.error('Error fetching goal:', error);
    });

    this.budgetService.getProfit().subscribe(profit => {
      this.profit = profit;
      this.updateProgress();
    }, error => {
      console.error('Error fetching profit:', error);
    });
  }

  updateProgress(): void {
    this.goalProgress = (this.profit / this.goal) * 100;
  }

  uploadInvoice(expense: any): void {
    // Logik zum Hochladen der Rechnung
  }
}
