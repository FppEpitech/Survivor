import { PaymentHistory, PaymentHistoryService } from './../../service/paymentHistory/payment-history.service';
import { CustomersService } from './../../service/customers/customers.service';
import { EncountersService } from './../../service/encounters/encounters.service';
import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Customer } from 'src/app/service/customers/customers.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports : [NgxChartsModule],
  standalone: true
})
export class StatisticsPageComponent {

    employees:Employee[] = [];
    coaches:Employee[] = [];
    customers:Customer[] = [];
    payments:PaymentHistory[] = [];

    customerResults : any = {}
    encounterResults : any = {}

    cardColor: string = '#fff4de';
    colorScheme:string = 'flame';

    nbEmployees: any = {};
    nbCoaches: any = {};
    nbCustomers: any = {};
    paymentAccount: any = {};

    constructor(
        private employeesService : EmployeesService,
        private encountersService: EncountersService,
        private customersService: CustomersService,
        private paymentHistoryService: PaymentHistoryService) { }

    ngOnInit(): void {
        this.initPayments();
        this.initCustomers();
        this.initEmployees();
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
            },
            (error) => {console.error("Failed to load Customers list", error);}
        );
    }

    initEmployees() {
        this.employeesService.getEmployees().subscribe(
            (data) => {
                this.employees = data;
                this.coaches = data.filter(employee => employee.work === 'Coach');
                this.nbEmployees[0] = this.employees;
                this.nbCoaches[0] = this.coaches;
                for (let employee of data) {
                    this.employeesService.getCustomers(employee.id).subscribe(
                        (data) => {
                            this.customerResults[employee.id] = data.length;
                            for (let customer of data) {
                                this.encountersService.getCustomerEncounters(customer.id).subscribe(
                                    (data) => {
                                        if (this.encounterResults[employee.id])
                                            this.encounterResults[employee.id] += data.length;
                                        else
                                            this.encounterResults[employee.id] = data.length;
                                    },
                                    (error) => {console.error("Failed to load encounter list", error);}
                                )
                            }
                        },
                        (error) => {console.error("Failed to load Employee list", error);});
                }

            },
            (error) => {console.error("Failed to load Employee list", error);}
        );
    }
}
