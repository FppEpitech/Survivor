import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent {
    indexEmployees = 0;

    employees: Employee[] = [];
    customers: Customer[] = [];

    constructor (private employeesService: EmployeesService, private customersService: CustomersService) {}

    ngOnInit(): void {
        this.employeesService.getEmployees().subscribe(
            (data) => { this.employees = data;
                console.log(this.employees);
            },
            (error) => { console.error("Failed to load Employees list", error); }
        );

        this.customersService.getCustomers().subscribe(
            (data) => { this.customers = data;
                console.log(this.customers);
            },
            (error) => { console.error("Failed to load Customers list", error); }
        );
    }
}
