import { TranslocoService } from '@ngneat/transloco';
import { Encounter, EncountersService } from './../../service/encounters/encounters.service';
import { PaymentHistory, PaymentHistoryService } from './../../service/paymentHistory/payment-history.service';
import { Component, OnInit } from '@angular/core';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {

    coach?: Employee;
    customer?: Customer

    customerImageUrl?: string;

    payments: PaymentHistory[] = [];
    encounters: Encounter[] = [];
    backupImageUrl = 'assets/placeholder-128.png';
    apiUrl = environment.apiUrl + '/';

    constructor (
        private employeesService: EmployeesService,
        private paymentHistoryService: PaymentHistoryService,
        private encountersService: EncountersService,
        private customerService: CustomersService,
        private route: ActivatedRoute,
        public _auth: AuthService,
        public _tloco : TranslocoService,
    ) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async params => {
            const id = params.get('id');
            if (id === null)
                return;
            let customerId = +id;
            this.customerService.getCustomer(customerId).then(async customer => {
                if (customer === undefined)
                    return;
                this.customer = customer;
                this.customerImageUrl = this.apiUrl + customer!.image_url;
                console.log(this.customerImageUrl);
                this.payments = await this.paymentHistoryService.getPaymentsCustomer(this.customer.id);
                this.encounters = await this.encountersService.getCustomerEncounters(this.customer.id);
                this.coach = await this.employeesService.getEmployee(this.customer.coach_id);
            });
        });
    }

    onImageError(event: any) {
        event.target.src = this.backupImageUrl;
    }

    getNumberSuccessEncounters() {
        return this.encounters.filter(encounter => encounter.rating > 3).length;
    }

    getNumberFailedEncounters() {
        return this.encounters.filter(encounter => encounter.rating <= 3).length;
    }
}
