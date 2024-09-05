import { Component } from '@angular/core';
import { Customer } from 'src/app/service/customers/customers.service';
import { EmployeesService, Employee } from 'src/app/service/employees/employees.service';

@Component({
  selector: 'app-astrological-compatibility',
  templateUrl: './astrological-compatibility.component.html',
  styleUrls: ['./astrological-compatibility.component.scss']
})
export class AstrologicalCompatibilityComponent {
    private coach?: Employee;
    customers : Customer[] = [];
    customerLeft?: Customer;
    customerRight?: Customer;

    compatibility = 0;

    constructor (private employeesService: EmployeesService) {}

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

    onRadioChange(customer: Customer, left: boolean) {
        if (left) {
            this.customerLeft = customer;
        } else {
            this.customerRight = customer;
        }
    }

    computeCompatibility() {

    }
}
