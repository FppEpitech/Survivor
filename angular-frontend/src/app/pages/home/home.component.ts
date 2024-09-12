import { DashboardCustomerStats, DashboardEncounterByDay, DashboardEncounterStats, DashboardEventByDay, DashboardEventStats, DashboardService } from './../../service/dashboard/dashboard.service';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoRootModule } from './../../transloco-root.module';
import { EncountersService } from './../../service/encounters/encounters.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

type PieChart = {
    name: string;
    value: number;
};

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports : [NgxChartsModule, TranslocoRootModule]
})

export class HomeComponent {

    customerStats?: DashboardCustomerStats;
    eventStats?: DashboardEventStats;
    encounterStats: DashboardEncounterStats[] = [];
    eventsByDay: DashboardEventByDay[] = [];
    encountersByDay: DashboardEncounterByDay[] = [];

    timeRangeValues = ["Last 7 days", "Last 30 days", "Last 3 Month"];
    timeRangePeriod = [7, 1, 3];
    timeRangeIdx = 1;
    timeRangeCustomerIdx = 1;

    EncounterPieChart: Array<{ name: string; value: number }> = [];
    EventByDayPieChart: Array<{ name: string; value: number }> = [];
    EncounterByDayPieChart: Array<{ name: string; value: number }> = [];

    constructor(
        public _auth: AuthService,
        private dashboardService: DashboardService,
        public _tloco: TranslocoService
    ) {}

    async ngOnInit() {
        this.getCustomerStats();
        this.getEventStats();
        this.getEncounterPieChartData();
        this.getEventByDayPieChartData();
        this.getEncounterByDayPieChartData();
    }

    changeTimeRange(index: number) {
        this.timeRangeIdx = index;
        this.timeRangeCustomerIdx = index;
        this.getCustomerStats();
        this.getEncounterPieChartData();
        this.getEventByDayPieChartData();
        this.getEncounterByDayPieChartData();
    }

    changeTimeRangeCustomer(index: number) {
        this.timeRangeCustomerIdx = index;
        this.getCustomerStats();
        this.getEncounterByDayPieChartData();
    }

    async getCustomerStats() {
        this.customerStats = await this.dashboardService.getCustomerStats(this.timeRangePeriod[this.timeRangeCustomerIdx]);
        if (this.customerStats && this.customerStats.averageCustomersPerCoach !== undefined) {
            this.customerStats.averageCustomersPerCoach = parseFloat(this.customerStats.averageCustomersPerCoach.toFixed(2));
        }
    }

    async getEventStats() {
        this.eventStats = await this.dashboardService.getEventStats();
        if (this.eventStats && this.eventStats.averageEventsPerDay !== undefined) {
            this.eventStats.averageEventsPerDay = parseFloat(this.eventStats.averageEventsPerDay.toFixed(2));
        }
    }

    async getEncounterStats() {
        this.encounterStats = await this.dashboardService.getEncounterStats(this.timeRangePeriod[this.timeRangeCustomerIdx]);
    }

    async getEncounterPieChartData() {
        await this.getEncounterStats();

        this.EncounterPieChart = [];
        for (let source of this.encounterStats) {
            if (source && source.source && source.count) {
                this.EncounterPieChart.push({ name: source.source, value: source.count });
            }
        }
    }

    async getEventByDay() {
        this.eventsByDay = await this.dashboardService.getEventByDay(this.timeRangePeriod[this.timeRangeCustomerIdx]);
    }

    async getEventByDayPieChartData() {
        await this.getEventByDay();

        this.EventByDayPieChart = [];
        for (let event of this.eventsByDay) {
            if (event) {
                this.EventByDayPieChart.push({ name: event.date, value: event.count });
            }
        }
    }

    async getEncounterByDay() {
        this.encountersByDay = await this.dashboardService.getEncounterByDay(this.timeRangePeriod[this.timeRangeCustomerIdx]);
    }

    async getEncounterByDayPieChartData() {
        await this.getEncounterByDay();

        this.EncounterByDayPieChart = [];
        for (let encounter of this.encountersByDay) {
            if (encounter && encounter.count && encounter.date) {
                this.EncounterByDayPieChart.push({ name: encounter.date, value: encounter.count });
            }
        }
    }
}
