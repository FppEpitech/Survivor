import { Compatibility, CompatibilityService } from './../../service/compatibility/compatibility.service';
import { Component } from '@angular/core';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { EmployeesService, Employee } from 'src/app/service/employees/employees.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-astrological-compatibility',
  templateUrl: './astrological-compatibility.component.html',
  styleUrls: ['./astrological-compatibility.component.scss']
})
export class AstrologicalCompatibilityComponent {
    private coach?: Employee;
    isCoach: boolean = false;
    customers : Customer[] = [];
    customerLeft?: Customer;
    customerRight?: Customer;

    customerLeftImageUrl?: string;
    customerRightImageUrl?: string;

    compatibility?: Compatibility;
    compatibilityPercentage = 0;

    apiUrl = environment.apiUrl;

    backupImageUrl = 'assets/placeholder-128.png';
    theme = localStorage.getItem('theme');

    constructor (private employeesService: EmployeesService, private compatibilityService: CompatibilityService, private customerService : CustomersService) {
        if (this.theme)
            document.documentElement.setAttribute('data-theme', this.theme);
    }

    async ngOnInit() {
        this.coach = await this.employeesService.getMe();
        if (this.coach !== undefined) {
            if (this.coach?.work === 'Coach')
                this.customers = await this.employeesService.getCustomers(this.coach?.id);
            else
                this.customers = await this.customerService.getCustomers();
        }
    }

    onRadioChange(customer: Customer, left: boolean) {
        this.compatibilityPercentage = 0;
        if (left) {
            this.customerLeft = customer;
            this.customerLeftImageUrl = this.apiUrl +  '/' + customer.image_url;
        } else {
            this.customerRight = customer;
            this.customerRightImageUrl = this.apiUrl + '/' + customer.image_url;
        }
    }

    async computeCompatibility() {
        if (!this.customerLeft || !this.customerRight)
            return;
        this.compatibility = await this.compatibilityService.getCompatibility(this.customerLeft.id, this.customerRight.id);
        if (this.compatibility !== undefined) {
            this.compatibilityPercentage = this.compatibility.compatibilityScore;
        }
    }

    onImageError(event: any) {
        event.target.src = this.backupImageUrl;
    }
}
