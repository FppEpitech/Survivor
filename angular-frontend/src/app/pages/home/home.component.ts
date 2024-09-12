import { DashboardCustomerStats, DashboardService } from './../../service/dashboard/dashboard.service';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoRootModule } from './../../transloco-root.module';
import { EncountersService } from './../../service/encounters/encounters.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports : [NgxChartsModule, TranslocoRootModule]
})

export class HomeComponent {

    customerStats?: DashboardCustomerStats;

    eventMonthly = 0;
    eventWeekly = 0;
    eventDaily = 0;

    timeRangeValues = ["Last 7 days", "Last 30 days", "Last 3 Month"];
    timeRangePeriod = [7, 1, 3];
    timeRangeIdx = 1;
    timeRangeCustomerIdx = 1;

    constructor(
        public _auth: AuthService,
        private dashboardService: DashboardService,
        public _tloco: TranslocoService
    ) {}

    async ngOnInit() {
        this.getCustomerStats();
    }

    changeTimeRange(index: number) {
        this.timeRangeIdx = index;
        this.timeRangeCustomerIdx = index;
        this.getCustomerStats();
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
}
