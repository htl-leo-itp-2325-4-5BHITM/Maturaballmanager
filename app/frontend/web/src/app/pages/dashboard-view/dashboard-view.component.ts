import { Component, OnInit } from '@angular/core';
import { NbActionsModule, NbCardModule, NbLayoutModule } from "@nebular/theme";
import { BaseChartDirective } from "ng2-charts";
import { CountdownTimerComponent } from "../../components/countdown-timer/countdown-timer.component";
import { CurrencyPipe } from "@angular/common";
import { NgxEchartsDirective } from "ngx-echarts";

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [NbLayoutModule, NbActionsModule, NbCardModule, BaseChartDirective, CountdownTimerComponent, CurrencyPipe, NgxEchartsDirective],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent implements OnInit {
  totalEarnings = 15000; // Beispiel für den aktuellen Gesamtumsatz
  earningsTarget = 20000; // Ziel für den Gesamtumsatz
  earningsProgress: number = 20; // Fortschritt in Prozent

  ticketsSold = 250; // Beispiel für die Anzahl der verkauften Tickets
  tablesSold = 50; // Beispiel für die Anzahl der verkauften Tische

  eventDate = new Date('2024-12-31T00:00:00'); // Beispiel für das Datum des Events
  countdownTime: number | undefined;

  chartOption: any;

  constructor() {}

  ngOnInit(): void {
    this.calculateCountdownTime();
    this.initializeChart();
    this.calculateEarningsProgress();
  }

  calculateCountdownTime() {
    const now = new Date();
    const diff = this.eventDate.getTime() - now.getTime();
    this.countdownTime = Math.floor(diff / 1000);
  }

  initializeChart() {
    this.chartOption = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Umsatz',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 5000, name: 'Category 1' },
            { value: 3000, name: 'Category 2' },
            { value: 2000, name: 'Category 3' },
            { value: 5000, name: 'Category 4' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  calculateEarningsProgress() {
    this.earningsProgress = (this.totalEarnings / this.earningsTarget) * 100;
  }
}
