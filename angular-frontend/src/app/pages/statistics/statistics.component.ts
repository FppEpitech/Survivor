import { EventsService } from './../../service/events/events.service';
import { TipsService } from './../../service/tips/tips.service';
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

    customerResults : any = {};
    encounterResults : any = {};
    genderResults : any = {};

    cardColor: string = '#fff4de';
    colorScheme:string = 'flame';

    nbEmployees: any = {};
    nbCoaches: any = {};
    nbCustomers: any = {};
    paymentAccount: any = {};
    nbTips: any = {};
    nbEncounters: any = {};
    nbEvents: any = {};

    constructor(
        private employeesService : EmployeesService,
        private encountersService: EncountersService,
        private customersService: CustomersService,
        private paymentHistoryService: PaymentHistoryService,
        private tipsService: TipsService,
        private eventsService: EventsService
    ) { }

    ngOnInit(): void {
        this.initPayments();
        this.initCustomers();
        this.initEmployees();
        this.initTips();
        this.initEncounters();
        this.initEvents();
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
                    this.genderResults[employee.id] = [0, 0, 0];
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
                                this.updateGender(customer.gender, employee.id);
                            }
                        },
                        (error) => {console.error("Failed to load Employee list", error);});
                }

            },
            (error) => {console.error("Failed to load Employee list", error);}
        );
    }

    initTips() {
        this.tipsService.getTips().subscribe(
            (data) => {
                this.nbTips[0] = data;
            },
            (error) => {console.error("Failed to load Tips list", error);}
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

    initEvents() {
        this.eventsService.getEvents().subscribe(
            (data) => {
                this.nbEvents[0] = data;
            },
            (error) => {console.error("Failed to load Events list", error);}
        );
    }

    updateGender(gender:string, id:number) {
        if (gender === 'Male')
            this.genderResults[id][0] += 1;
        else if (gender === 'Female')
            this.genderResults[id][1] += 1;
        else
        this.genderResults[id][2] += 1;
    }
}
