import { DashboardCustomerStats, DashboardEncounterStats, DashboardEventStats, DashboardService } from './../../service/dashboard/dashboard.service';
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

    timeRangeValues = ["Last 7 days", "Last 30 days", "Last 3 Month"];
    timeRangePeriod = [7, 1, 3];
    timeRangeIdx = 1;
    timeRangeCustomerIdx = 1;

    EncounterPieChart: Array<{ name: string; value: number }> = [];

    constructor(
        public _auth: AuthService,
        private dashboardService: DashboardService,
        public _tloco: TranslocoService
    ) {}

    async ngOnInit() {
        this.getCustomerStats();
        this.getEventStats();
        this.getEncounterPieChartData();
    }

    changeTimeRange(index: number) {
        this.timeRangeIdx = index;
        this.timeRangeCustomerIdx = index;
        this.getCustomerStats();
        this.getEncounterPieChartData();
    }

    changeTimeRangeCustomer(index: number) {
        this.timeRangeCustomerIdx = index;
        this.getCustomerStats();
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
}
