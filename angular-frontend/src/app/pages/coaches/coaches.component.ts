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
    changesOccuredCustomer = false;
    isLoading = false;
    search = "";
    searchCustomer = "";
    action = "Simple Action"
    customerPageChoice = false;
    displayFavorites = false;

    employees: Employee[] = [];
    allEmployees: Employee[] = [];
    customers: Customer[] = [];
    allCustomers: Customer[] = [];
    coachToAddCustomers?: Employee;

    customerToSave: { [id: number] : Customer; } = {};
    customerToRemove: { [id: number] : Customer; } = {};
    employeeToDelete: { [id: number] : Employee; } = {};
    employeeCheck: { [id: number] : Employee; } = {};

    oldId: { [id: number] : number; } = {};

    constructor (
        private employeesService: EmployeesService,
        private customersService: CustomersService,
        private router: Router) {}

    async ngOnInit() {
        this.employees = (await this.employeesService.getEmployees()).filter(employee => employee.work === 'Coach');
        this.allEmployees = this.employees;
        this.customers = await this.customersService.getCustomers();
        this.allCustomers = this.customers;
    }

    async apply() {
        if (!this.changesOccured)
            return;
        this.changesOccured = false;
        for (let key in this.employeeToDelete) {
            let employee = this.employeeToDelete[key];
            this.employeesService.deleteEmployee(employee.id);
        }
        this.employees = (await this.employeesService.getEmployees()).filter(employee => employee.work === 'Coach');
        this.allEmployees = this.employees;
    }

    goToSignIn() {
        this.router.navigate(["/register-employee"])
    }

    searchBar() {
        if (this.search === "") {
            this.employees = this.allEmployees;
            return;
        }
        this.employees = this.allEmployees.filter(employee =>
            employee.name.toLowerCase().startsWith(this.search.toLowerCase())
        );
    }

    searchBarCustomer() {
        if (this.searchCustomer === "") {
            this.customers = this.allCustomers;
            return;
        }
        this.customers = this.allCustomers.filter(customer =>
            customer.name.toLowerCase().startsWith(this.searchCustomer.toLowerCase())
        );
    }

    changeAction(action: string) {
        this.action = action;
        this.employeeCheck = {};
    }

    checkEmployee(ischeck: boolean, employee: Employee) {
        if (ischeck) {
            this.employeeCheck[employee.id] = employee;
        } else {
            delete this.employeeCheck[employee.id];
        }
    }

    deleteManyEmployees() {
        this.changesOccured = true;
        for (let key in this.employeeCheck) {
            let employee = this.employeeCheck[key];
            this.employeeToDelete[employee.id] = employee;
        }
    }

    deleteButton(employee: Employee) {
        this.changesOccured = true;
        this.employeeToDelete[employee.id] = employee;
    }

    restoreButton(employee: Employee) {
        this.changesOccured = true;
        delete this.employeeToDelete[employee.id];
    }

    openCustomerPageChoice(employee: Employee) {
        this.coachToAddCustomers = employee;
        this.customerPageChoice = true;
        this.customerToSave = {};
        this.customerToRemove = {};
        this.changesOccuredCustomer = false;
        this.customers = this.allCustomers;
    }

    backEmployeePage() {
        for (let key in this.customerToSave) {
            let customer = this.customerToSave[key];
            customer.coach_id = this.oldId[customer.id];
        }

        for (let key in this.customerToRemove) {
            let customer = this.customerToRemove[key];
            customer.coach_id = this.oldId[customer.id];
        }

        this.coachToAddCustomers = undefined;
        this.customerPageChoice = false;
        this.customerToSave = {};
        this.customerToRemove = {};
        this.changesOccuredCustomer = false;
    }

    addCustomers() {

        for (let key in this.customerToSave) {
            let customer = this.customerToSave[key];
            this.customersService.updateCustomer(customer.id, customer);
        }

        for (let key in this.customerToRemove) {
            let customer = this.customerToRemove[key];
            this.customersService.updateCustomer(customer.id, customer);
        }

        this.coachToAddCustomers = undefined;
        this.customerPageChoice = false;
        this.customerToSave = [];
        this.customerToRemove = [];
        this.changesOccuredCustomer = false;
    }

    addCustomerToCoachButton(customer: Customer) {
        if (this.coachToAddCustomers) {
            if (this.oldId[customer.id] === undefined)
                this.oldId[customer.id] = customer.coach_id;
            customer.coach_id = this.coachToAddCustomers.id;
            delete this.customerToRemove[customer.id];
            this.customerToSave[customer.id] = customer;
            this.changesOccuredCustomer = true;
        }
    }

    removeCustomerToCoachButton(customer: Customer) {
        if (this.coachToAddCustomers) {
            if (this.oldId[customer.id] === undefined)
                this.oldId[customer.id] = customer.coach_id;
            customer.coach_id = -1;
            delete this.customerToSave[customer.id];
            this.customerToRemove[customer.id] = customer;
            this.changesOccuredCustomer = true;
        }
    }

    filterFavorite() {
        this.displayFavorites = true;
        this.employees.sort((a, b) => a.name.localeCompare(b.name));
    }

    exportEmployeesAsJSON() {
        const dataStr = JSON.stringify(this.employees, null, 2); // Format with 2 spaces for readability
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');

        link.href = window.URL.createObjectURL(blob);
        link.download = 'employees.json';
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
}
