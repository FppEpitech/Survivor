import { Encounter, EncountersService } from './../../service/encounters/encounters.service';
import { PaymentHistory, PaymentHistoryService } from './../../service/paymentHistory/payment-history.service';
import { Component } from '@angular/core';
import { Customer } from 'src/app/service/customers/customers.service';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';

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

    backupImageUrl = 'assets/placeholder-128.png';

    constructor (
        private employeesService: EmployeesService,
        private paymentHistoryService: PaymentHistoryService,
        private encountersService: EncountersService
    ) {}

    ngOnInit(): void {
        this.employeesService.getMe().subscribe(
            (data) => {
                this.coach = data;
                this.employeesService.getCustomers(this.coach?.id).subscribe(
                    (data) => { this.customers = data; },
                    (error) => { console.error("Failed to load Customers list", error); }
                );
            },
            (error) => { console.error("Failed to load coach me", error); }
        );
    }

    onRadioChange(newCustomer: Customer) {
        this.customer = newCustomer;
        this.customerImageUrl = '/api/' + this.customer.image_url;
        this.paymentHistoryService.getPayments(this.customer.id).subscribe(
            (data) => { this.payments = data; console.log(data)},
            (error) => { console.error("Failed to load payments list", error); }
        );
        this.encountersService.getCustomerEncounters(this.customer.id).subscribe(
            (data) => { this.encounters = data; console.log(data)},
            (error) => { console.error("Failed to load encounters list", error); }
        );
    }

    onImageError(event: any) {
        event.target.src = this.backupImageUrl;
    }
}
