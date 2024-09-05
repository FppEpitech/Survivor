import { Component } from '@angular/core';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { EmployeesService, Employee } from 'src/app/service/employees/employees.service';

@Component({
  selector: 'app-astrological-compatibility',
  templateUrl: './astrological-compatibility.component.html',
  styleUrls: ['./astrological-compatibility.component.scss']
})
export class AstrologicalCompatibilityComponent {
    customerLeft?: Customer;
    customerRight?: Customer;

    customers : Customer[] = [];

    coach?: Employee;

    compatibility = 0;

    constructor (private customersService: CustomersService, private employeesService: EmployeesService) {}

    ngOnInit(): void {
        // this.employeesService.getEmployee().subscribe(
        //     (data) => { this.employees = data; console.log(this.employees)},
        //     (error) => { console.error("Failed to load Employees list", error); }
        // );

        this.customersService.getCustomers().subscribe(
            (data) => { this.customers = data; },
            (error) => { console.error("Failed to load Customers list", error); }
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
