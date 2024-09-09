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

    ngOnInit(): void {
      this.employeesService.getMe().subscribe((employee : Employee) => {
        this.isCoach = employee.work === 'Coach';
        this.coach = employee
        if (this.isCoach) {
          this.employeesService.getCustomers(employee.id).subscribe((customers) => {
            this.customers = customers;
          });
        } else {
          this.customerService.getCustomers().subscribe((customers) => {
            this.customers = customers;
          });
        }
      });
    }

    onRadioChange(newCustomer: Customer) {
        this.customer = newCustomer;
        this.customerImageUrl = this.apiUrl + this.customer.image_url;
        this.paymentHistoryService.getPaymentsCustomer(this.customer.id).subscribe(
            (data) => { this.payments = data; console.log(data)},
            (error) => { console.error("Failed to load payments list", error); }
        );
        this.encountersService.getCustomerEncounters(this.customer.id).subscribe(
            (data) => { this.encounters = data; console.log(`Encounters : ${data}`)},
            (error) => { console.error("Failed to load encounters list", error); }
        );
    }

    onImageError(event: any) {
        event.target.src = this.backupImageUrl;
    }
}
