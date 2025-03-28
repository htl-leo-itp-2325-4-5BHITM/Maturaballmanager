import {Component, OnInit} from '@angular/core';
import {NbActionsModule, NbCardModule, NbLayoutModule} from "@nebular/theme";
import {BaseChartDirective} from "ng2-charts";
import {CurrencyPipe, NgForOf, NgStyle} from "@angular/common";
import {NgxEchartsDirective, NgxEchartsModule} from "ngx-echarts";
import {FinanceService} from "../../services/finance.service";
import {CountdownTimerComponent} from "../../components/countdown-timer/countdown-timer.component";
import {UserManagementService} from "../../services/user-management.service";
import {PromService} from "../../services/prom.service";
import {PromDTO} from "../../model/dtos/prom.dto";

interface Member {
    id: number;
    keycloakId: string;
    name: string;
    email: string;
    roles: string[];
    lastLogin: string;
}

@Component({
    selector: 'app-dashboard-view',
    standalone: true,
    imports: [NbLayoutModule, NbActionsModule, NbCardModule, CountdownTimerComponent, BaseChartDirective, CurrencyPipe, NgxEchartsDirective, NgxEchartsModule, NgForOf, NgStyle],
    templateUrl: './dashboard-view.component.html',
    styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent implements OnInit {

    earningsTarget = 20000;
    earningsProgress: number = 20;
    totalEarnings: number = 0;
    ticketsSold = 250;
    tablesSold = 50;
    membersByRole: { [role: string]: number } = {};
    activeProm: any;

    eventDate = new Date('2025-03-13T19:00:00');
    countdownTime: number | undefined;

    chartOption: any;

    constructor(private financeService: FinanceService, private userService: UserManagementService, private promService: PromService) {
    }

    ngOnInit(): void {
        this.calculateCountdownTime();
        this.initializeChart();
        this.getProm();
        this.getEventDate();
        this.getMembers();

        this.financeService.getBalance().subscribe(balance => {
            this.totalEarnings = Number(balance);
            this.calculateEarningsProgress();
        });
    }

    getEventDate() {
        this.promService.getActiveProm().then((prom: PromDTO | undefined) => {
            if (prom) {
                const combinedDateTime = `${prom.date}T${prom.time}`;
                console.log(prom.date);
                console.log(prom);
                this.eventDate = new Date(combinedDateTime);
                console.log('Combined Event Date:', this.eventDate);
            } else {
                console.error('Invalid activeProm data:', prom);
            }
        })
    }

    getProm() {
        this.promService.getActiveProm().then((prom: PromDTO | undefined) => {
            this.activeProm = prom;
        })
    }

    formatDate(date: string): string {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}.${month}.${year}`;
    }

    formatTime(time: string): string {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    }

    members: any[] = [];
    maturaleitungMembers: any[] = [];
    getMembers() {
        this.userService.getTeamMembers().subscribe(members => {
            if (members.length >= 1) {
                this.members = members;

                // Filter for members with the 'Maturaleitung' role
                this.maturaleitungMembers = members
                    .filter(member => member.realmRoles.includes('management'))
                    .map(member => ({
                        ...member,
                        realmRoles: member.realmRoles.map(role => {
                            switch (role) {
                                case 'management':
                                    return 'Maturaballleitung';
                                case 'finance':
                                    return 'Finanzen';
                                case 'sponsoring':
                                    return 'Sponsoring';
                                default:
                                    return role;
                            }
                        }),
                    }));

                if (this.maturaleitungMembers.length === 0) {
                    console.warn('No members with the role "Maturaleitung" found.');
                }
            } else {
                console.error('No member found');
            }
        });
    }




    getRoles(): string[] {
        return Object.keys(this.membersByRole);
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
                        {value: 5000, name: 'Category 1'},
                        {value: 3000, name: 'Category 2'},
                        {value: 2000, name: 'Category 3'},
                        {value: 5000, name: 'Category 4'}
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
