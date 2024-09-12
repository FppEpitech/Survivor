import { CustomerCreation, CustomersService } from 'src/app/service/customers/customers.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

type DateObject = {
    day: number;
    month: number;
};

type AstrologicalSign = {
    name: string;
    start: DateObject;
    end: DateObject;
};

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
    astrological_sign?: string;
    coach_id = -1;
    clothes = "";
    image_url = "";

    isCustomer = false;

    newCustomer?: CustomerCreation;

    constructor(private customersService: CustomersService, private router : Router, public _tloco : TranslocoService) {}

    async createAccount() {
        if (!this.name || !this.surname || !this.date || !this.email || !this.gender || !this.description) {
            console.log("empty tag");
            return;
        }

        const date = new Date(this.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        this.astrological_sign = this.getAstrologicalSign(day, month);

        if (this.astrological_sign === undefined)
            this.astrological_sign = "";

        console.log(this.astrological_sign);

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

    getAstrologicalSign(day: number, month: number): string | undefined {
        const signs: AstrologicalSign[] = [
          { name: "Capricorne", start: { day: 22, month: 12 }, end: { day: 19, month: 1 } },
          { name: "Verseau", start: { day: 20, month: 1 }, end: { day: 18, month: 2 } },
          { name: "Poissons", start: { day: 19, month: 2 }, end: { day: 20, month: 3 } },
          { name: "Bélier", start: { day: 21, month: 3 }, end: { day: 19, month: 4 } },
          { name: "Taureau", start: { day: 20, month: 4 }, end: { day: 20, month: 5 } },
          { name: "Gémeaux", start: { day: 21, month: 5 }, end: { day: 20, month: 6 } },
          { name: "Cancer", start: { day: 21, month: 6 }, end: { day: 22, month: 7 } },
          { name: "Lion", start: { day: 23, month: 7 }, end: { day: 22, month: 8 } },
          { name: "Vierge", start: { day: 23, month: 8 }, end: { day: 22, month: 9 } },
          { name: "Balance", start: { day: 23, month: 9 }, end: { day: 22, month: 10 } },
          { name: "Scorpion", start: { day: 23, month: 10 }, end: { day: 21, month: 11 } },
          { name: "Sagittaire", start: { day: 22, month: 11 }, end: { day: 21, month: 12 } }
        ];

        for (const sign of signs) {
            if (
                (month === sign.start.month && day >= sign.start.day) ||
                (month === sign.end.month && day <= sign.end.day)
            ) {
                return sign.name;
            }
        }
        return undefined;
    }
}
