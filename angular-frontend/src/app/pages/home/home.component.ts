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

    payments: PaymentHistory[] = [];
    customers: Customer[] = [];
    employees: Employee[] = [];
    coach?: Employee;

    paymentAccount: any = {};
    nbCustomers: any = {};
    nbEmployees: any = {};
    nbEncounters: any = {};
    genders = [0,0,0];

    constructor(
        public _auth: AuthService,
        private paymentHistoryService: PaymentHistoryService,
        private customersService: CustomersService,
        private employeesService: EmployeesService,
        private encountersService: EncountersService
    ) {}

    async ngOnInit() {
        if (this._auth.isManager()) {
            await this.initPayments();
            await this.initCustomers();
            this.initGender(this.customers);
            this.initEmployees();
            this.initEncounters();
        } else {
            this.coach = await this.employeesService.getMe();
            if (this.coach) {
                this.customers = await this.employeesService.getCustomers(this.coach.id);
                this.nbCustomers[0] = this.customers;
                this.nbEncounters[0] = 0;
                this.initGender(this.customers);
                for (let customer of this.customers) {
                    this.nbEncounters[0] += (await this.encountersService.getCustomerEncounters(customer.id)).length;
                }
            }
        }
    }

    async initPayments() {
        this.payments = await this.paymentHistoryService.getPayments();
        this.paymentAccount[0] = 0;
        for (let payment of this.payments) {
            this.paymentAccount[0] += payment.amount;
        }
    }

    async initCustomers() {
        this.customers = await this.customersService.getCustomers();
        this.nbCustomers[0] = this.customers || 0;
    }

    initGender(customers:Customer[]) {
        for (let customer of customers) {
            if (customer.gender === 'Male')
                this.genders[0] += 1;
            else if (customer.gender === 'Female')
                this.genders[1] += 1;
            else
                this.genders[2] += 1;
        }
    }

    async initEmployees () {
        this.employees = (await this.employeesService.getEmployees()).filter(employee => employee.work === 'Coach');
        this.nbEmployees[0] = this.employees;
    }

    async initEncounters() {
        this.nbEncounters[0] = await this.encountersService.getEncounters();
    }
}
