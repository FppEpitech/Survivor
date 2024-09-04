import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent {
    employees: Employee[] = [];

    constructor (private employeesService: EmployeesService) {}

    ngOnInit(): void {
        this.employeesService.getEmployees().subscribe(
            (data) => { this.employees = data;
                console.log(this.employees);
            },
            (error) => { console.error("Failed to load Employees list", error); }
        );
    }
}
