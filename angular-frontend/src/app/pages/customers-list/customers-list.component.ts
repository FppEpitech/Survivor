import { TranslocoService } from '@ngneat/transloco';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { PaymentHistory, PaymentHistoryService } from 'src/app/service/paymentHistory/payment-history.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent {

    employee?: Employee;
    customers: Customer[] = [];
    allCustomers: Customer[] = [];

    changesOccured = false;
    action = "Simple Action";
    search = "";
    displayFavorites = false;

    customerCheck: { [id: number] : Customer; } = {};
    customersToDelete: { [id: number] : Customer; } = {};
    payments: { [id: number] : PaymentHistory[]; } = {};

    constructor (
        private employeesService: EmployeesService,
        private customersService: CustomersService,
        public _auth: AuthService,
        private router: Router,
        public _tloco : TranslocoService) {}

    async ngOnInit() {
        this.employee = await this.employeesService.getMe();
        if (this.employee?.work === 'Coach') {
            this.customers = await this.employeesService.getCustomers(this.employee?.id);
        } else {
            this.customers = await this.customersService.getCustomers();
        }
        this.allCustomers = this.customers;
        this.action = this._tloco.translate('simpleActionBtn')
        this._tloco.langChanges$.subscribe(() => {
            this.action = this._tloco.translate('simpleActionBtn')
        });
    }

    exportCustomersAsJSON() {
        const dataStr = JSON.stringify(this.customers, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');

        link.href = window.URL.createObjectURL(blob);
        link.download = 'employees.json';
        link.click();
        window.URL.revokeObjectURL(link.href);
    }

    goToCustomerCreation() {
        this.router.navigate(["/register-customer"]);
    }

    changeAction(action: string) {
        this.action = action;
        this.customerCheck = {};
    }

    async apply() {
        if (!this.changesOccured)
            return;
        this.changesOccured = false;
        for (let key in this.customersToDelete) {
            let customer = this.customersToDelete[key];
            await this.customersService.deleteCustomer(customer.id);
        }
        if (this.employee?.work === 'Coach') {
            this.customers = await this.employeesService.getCustomers(this.employee?.id);
        } else {
            this.customers = await this.customersService.getCustomers();
        }
        this.allCustomers = this.customers;
    }

    deleteManyCustomers() {
        this.changesOccured = true;
        for (let key in this.customerCheck) {
            let customer = this.customerCheck[key];
            this.customersToDelete[customer.id] = customer;
        }
    }

    searchBar() {
        if (this.search === "") {
            this.customers = this.allCustomers;
            return;
        }
        this.customers = this.allCustomers.filter(customer =>
            customer.name.toLowerCase().startsWith(this.search.toLowerCase())
        );
    }

    filterFavorite() {
        this.displayFavorites = true;
        this.customers.sort((a, b) => a.name.localeCompare(b.name));
    }

    checkCustomer(ischeck: boolean, customer: Customer) {
        if (ischeck) {
            this.customerCheck[customer.id] = customer;
        } else {
            delete this.customerCheck[customer.id];
        }
    }

    deleteButton(customer: Customer) {
        this.changesOccured = true;
        this.customersToDelete[customer.id] = customer;
    }

    restoreButton(customer: Customer) {
        this.changesOccured = true;
        delete this.customersToDelete[customer.id];
    }

    goToCustomerPage(customer: Customer) {
        this.router.navigate([`/client-profile/${customer.id}`]);
    }
}
