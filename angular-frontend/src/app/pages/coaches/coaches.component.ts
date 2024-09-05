import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent {
    changesOccured = false;
    isLoading = false;

    employees: Employee[] = [];
    customers: Customer[] = [];

    customerToSave: { [id: number] : Customer; } = {};

    constructor (private employeesService: EmployeesService, private customersService: CustomersService) {}

    ngOnInit(): void {
        this.employeesService.getEmployees().subscribe(
            (data) => { this.employees = data; console.log(this.employees)},
            (error) => { console.error("Failed to load Employees list", error); }
        );

        this.customersService.getCustomers().subscribe(
            (data) => { this.customers = data; },
            (error) => { console.error("Failed to load Customers list", error); }
        );
    }

    saveChanges() {
        this.isLoading = true;
        this.changesOccured = false;

        for (let key in this.customerToSave) {
            let customer = this.customerToSave[key];
            this.customersService.updateCustomer(customer.id, customer).subscribe(
                null,
                (error) => { console.error("Failed to update customer", error); }
            );
        }

        this.isLoading = false;
    }

    onCheckboxChange(event: Event, customer: Customer, idCoach: number) {
        this.changesOccured = true;
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.addCoach(customer, idCoach);
        } else {
            this.removeCoach(customer);
        }
    }

    addCoach (customer: Customer, idCoach: number) {
        customer.coach_id = idCoach;
        this.customerToSave[customer.id] = customer;
    }

    removeCoach (customer: Customer) {
        customer.coach_id = -1;
        this.customerToSave[customer.id] = customer;
    }
}
