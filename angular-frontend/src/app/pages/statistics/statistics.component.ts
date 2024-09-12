import { TranslocoService } from '@ngneat/transloco';
import { TranslocoRootModule } from './../../transloco-root.module';
import { EventsService } from './../../service/events/events.service';
import { TipsService } from './../../service/tips/tips.service';
import { PaymentHistory, PaymentHistoryService } from './../../service/paymentHistory/payment-history.service';
import { CustomersService } from './../../service/customers/customers.service';
import { Encounter, EncountersService } from './../../service/encounters/encounters.service';
import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Customer } from 'src/app/service/customers/customers.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports : [NgxChartsModule, TranslocoRootModule],
  standalone: true
})
export class StatisticsPageComponent {

    employees:Employee[] = [];
    coaches:Employee[] = [];
    customers:Customer[] = [];
    employeesCustomers:Customer[] = [];
    encounters: Encounter[] = [];
    payments:PaymentHistory[] = [];

    me?: Employee;
    coache?: Employee;

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
        private eventsService: EventsService,
        public _auth: AuthService,
        public _tloco : TranslocoService
    ) { }

    async ngOnInit() {
        if (this._auth.isManager()) {
            this.initTips();
            this.initEvents();
            await this.initPayments();
            await this.initEncounters();
            await this.initCustomers();
        }
        await this.initEmployees();
    }

    async initPayments() {
        this.payments = await this.paymentHistoryService.getPayments();
        if (this.payments !== undefined) {
            for (let payment of this.payments) {
                if (this.paymentAccount[0] !== undefined)
                    this.paymentAccount[0] += payment.amount;
                else
                    this.paymentAccount[0] = payment.amount;
            }
        }
    }

    async initCustomers() {
        this.nbCustomers[0] = await this.customersService.getCustomers();
    }

    async initEmployees() {

        if (this._auth.isManager()) {
            this.employees = await this.employeesService.getEmployees();
            this.coaches = this.employees.filter(employee => employee.work == 'Coach');
        } else {
            this.me = await this.employeesService.getMe();
            if (this.me !== undefined) {
                this.employees = [this.me];
                this.coaches = [this.me];
            }
        }
        this.nbEmployees[0] = this.employees;
        this.nbCoaches[0] = this.coaches;
        this.coaches = this.coaches.filter(coach => coach.customerCount != undefined && coach.customerCount > 0);


        for (let coach of this.coaches) {
            if (coach.customerCount == undefined || coach.customerCount == 0) {
                this.coaches.splice(this.coaches.indexOf(coach), 1);
                continue;
            }
            this.employeesCustomers = await this.employeesService.getCustomers(coach.id);
            this.genderResults[coach.id] = [0, 0, 0];
            this.customerResults[coach.id] = this.employeesCustomers.length;
            for (let customer of this.employeesCustomers) {
                this.encounters = await this.encountersService.getCustomerEncounters(customer.id);
                if (this.encounterResults[coach.id])
                    this.encounterResults[coach.id] += this.encounters.length;
                else
                    this.encounterResults[coach.id] = this.encounters.length;
                this.updateGender(customer.gender, coach.id);
            }
        }
        this.coache = this.coaches.at(0);
    }

    initTips() {
        this.tipsService.getTips().subscribe(
            (data) => {
                this.nbTips[0] = data;
            },
            (error) => {console.error("Failed to load Tips list", error);}
        );
    }

    async initEncounters() {
        this.nbEncounters[0] = await this.encountersService.getEncounters();
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

    chooseCoach(coach: Employee) {
        this.coache = coach;
    }
}
