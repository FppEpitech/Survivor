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
  imports : [NgxChartsModule]
})

export class HomeComponent {

    payments:PaymentHistory[] = [];
    customers:Customer[] = [];
    employees:Employee[] = [];

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

    ngOnInit(): void {
        if (this._auth.isManager()) {
            this.initPayments();
            this.initCustomers();
            this.initEmployees();
            this.initEncounters();
        }
    }

    initPayments() {
        this.paymentHistoryService.getPayments().subscribe(
            (data) => {
                this.payments = data;
                for (let payment of this.payments) {
                    if (this.paymentAccount[0] !== undefined)
                        this.paymentAccount[0] += payment.amount;
                    else
                        this.paymentAccount[0] = payment.amount;
                }
            },
            (error) => {console.error("Failed to load Payment history list", error);}
        );
    }

    initCustomers() {
        this.customersService.getCustomers().subscribe(
            (data) => {
                this.customers = data;
                this.nbCustomers[0] = this.customers;
                this.initGender(this.customers);
            },
            (error) => {console.error("Failed to load Customers list", error);}
        );
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

    initEmployees () {
        this.employeesService.getEmployees().subscribe(
            (data) => {
                this.employees = data.filter(employee => employee.work === 'Coach');
                this.nbEmployees[0] = this.employees;
            },
            (error) => {console.error("Failed to load Employees list", error);}
        );
    }

    initEncounters() {
        this.encountersService.getEncounters().subscribe(
            (data) => {
                this.nbEncounters[0] = data;
            },
            (error) => {console.error("Failed to load Encounters list", error);}
        );
    }
}
