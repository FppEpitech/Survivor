import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { EmployeeCreation, EmployeesService } from '../../service/employees/employees.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss']
})
export class RegisterEmployeeComponent {

    name = "";
    surname = "";
    date = "";
    email = "";
    gender = "";
    password = "";
    workType = "";
    work = "";

    isEmployee = false;

    newEmployee?: EmployeeCreation;

    constructor(private employeesService: EmployeesService, private router : Router, public _tloco : TranslocoService) {}

    async createAccount() {
        if (!this.name || !this.surname || !this.date || !this.email || !this.gender || !this.password || !this.workType) {
            console.log("empty tag");
            return;
        }
        if (this.workType === 'coach') {
            this.work = 'Coach';
        }
        if (this.workType !== 'coach' && !this.work) {
            console.log("empty tag");
            return;
        }

        this.newEmployee = {
            name: this.name,
            surname: this.surname,
            birth_date: this.date,
            email: this.email,
            gender: this.gender,
            password: this.password,
            work: this.work,
            image_url: ""
        };

        if (await this.employeesService.createEmployee(this.newEmployee) === undefined)
            return;
        this.router.navigate(["/coaches"]);
    }

    setEmployee(Employee:boolean) {
        this.isEmployee = Employee;
    }
}
