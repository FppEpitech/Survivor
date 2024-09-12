import { TranslocoService } from '@ngneat/transloco';
import { TranslocoRootModule } from './../../transloco-root.module';
import { EncountersService } from './../../service/encounters/encounters.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PaymentHistory, PaymentHistoryService } from 'src/app/service/paymentHistory/payment-history.service';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports : [NgxChartsModule, TranslocoRootModule]
})

export class HomeComponent {

    customers: Customer[] = [];
    doingMeetings = 0;
    customersPerCoach = 0;

    eventMonthly = 0;
    eventWeekly = 0;
    eventDaily = 0;

    constructor(
        public _auth: AuthService,
        private paymentHistoryService: PaymentHistoryService,
        private customersService: CustomersService,
        private employeesService: EmployeesService,
        private encountersService: EncountersService,
        public _tloco: TranslocoService
    ) {}

    async ngOnInit() {
        this.customers = await this.customersService.getCustomers();
    }
}
