import { Encounter, EncountersService } from './../../service/encounters/encounters.service';
import { PaymentHistory, PaymentHistoryService } from './../../service/paymentHistory/payment-history.service';
import { Component } from '@angular/core';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent {

    coach?: Employee;
    customers : Customer[] = [];
    customer?: Customer;

    customerImageUrl?: string;

    payments: PaymentHistory[] = [];
    encounters: Encounter[] = [];
    isCoach : boolean = false;
    backupImageUrl = 'assets/placeholder-128.png';
    apiUrl = environment.apiUrl + '/';

    constructor (
        private employeesService: EmployeesService,
        private paymentHistoryService: PaymentHistoryService,
        private encountersService: EncountersService,
        private customerService: CustomersService,
    ) {}

    async ngOnInit() {
        this.coach = await this.employeesService.getMe();
        if (this.coach?.work === 'Coach') {
            this.customers = await this.employeesService.getCustomers(this.coach?.id);
        } else {
            this.customers = await this.customerService.getCustomers();
        }
    }

    async onRadioChange(newCustomer: Customer) {
        this.customer = newCustomer;
        this.customerImageUrl = this.apiUrl + this.customer.image_url;
        this.payments = await this.paymentHistoryService.getPaymentsCustomer(this.customer.id);
        this.encounters = await this.encountersService.getCustomerEncounters(this.customer.id);
    }

    onImageError(event: any) {
        event.target.src = this.backupImageUrl;
    }
}
