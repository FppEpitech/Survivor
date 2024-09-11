import { CustomerCreation, CustomersService } from 'src/app/service/customers/customers.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.scss']
})
export class RegisterCustomerComponent {
    name = "";
    surname = "";
    date = "";
    email = "";
    gender = "";
    description = "";
    astrological_sign = "";
    coach_id = -1;
    clothes = "";
    image_url = "";

    isCustomer = false;

    newCustomer?: CustomerCreation;

    constructor(private customersService: CustomersService, private router : Router, public _tloco : TranslocoService) {}

    async createAccount() {
        if (!this.name || !this.surname || !this.date || !this.email || !this.gender || !this.description || !this.astrological_sign) {
            console.log("empty tag");
            return;
        }
        this.newCustomer = {
            name: this.name,
            surname: this.surname,
            birth_date: this.date,
            email: this.email,
            gender: this.gender,
            image_url: this.image_url,
            astrological_sign: this.astrological_sign,
            coach_id: this.coach_id,
            clothes: this.clothes,
            description: this.description
        };

        if (await this.customersService.createCustomer(this.newCustomer) === undefined)
            return;
        this.router.navigate(["/customers-list"]);
    }
}
