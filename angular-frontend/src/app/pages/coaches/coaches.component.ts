import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { Router } from '@angular/router';

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

    constructor (
        private employeesService: EmployeesService,
        private customersService: CustomersService,
        private router: Router) {}

    async ngOnInit() {
        this.employees = (await this.employeesService.getEmployees()).filter(employee => employee.work === 'Coach');
        this.customers = await this.customersService.getCustomers();
    }

    saveChanges() {
        this.isLoading = true;
        this.changesOccured = false;

        for (let key in this.customerToSave) {
            let customer = this.customerToSave[key];
            this.customersService.updateCustomer(customer.id, customer);
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

    goToSignIn() {
        this.router.navigate(["/register-employee"])
    }

    goToDelete() {
        this.router.navigate(["/delete-employee"])
    }
}
