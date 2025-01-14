import {Component, OnInit} from '@angular/core';
import {NbActionsModule, NbCardModule, NbLayoutModule} from "@nebular/theme";
import {BaseChartDirective} from "ng2-charts";
import {CurrencyPipe} from "@angular/common";
import {NgxEchartsDirective, NgxEchartsModule} from "ngx-echarts";
import {FinanceService} from "../../services/finance.service";
import {CountdownTimerComponent} from "../../components/countdown-timer/countdown-timer.component";

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [NbLayoutModule, NbActionsModule, NbCardModule, CountdownTimerComponent, BaseChartDirective, CurrencyPipe, NgxEchartsDirective, NgxEchartsModule],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent implements OnInit {

  earningsTarget = 20000;
  earningsProgress: number = 20;
  totalEarnings: number = 0;
  ticketsSold = 250;
  tablesSold = 50;

  eventDate = new Date('2025-03-07T19:00:00');
  countdownTime: number | undefined;

  chartOption: any;

  constructor(private financeService: FinanceService) {
  }

  ngOnInit(): void {
    this.calculateCountdownTime();
    this.initializeChart();

    this.financeService.getBalance().subscribe(balance => {
      this.totalEarnings = Number(balance);
      this.calculateEarningsProgress();
    });
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
