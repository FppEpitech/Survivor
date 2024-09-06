import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Customer } from 'src/app/service/customers/customers.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports : [NgxChartsModule],
  standalone: true
})
export class StatisticsPageComponent {

    employees:Employee[] = [];
    customerResults : any = {}

    constructor(private employeesService : EmployeesService) { }

    ngOnInit(): void {
        this.employeesService.getEmployees().subscribe(
        (data) => {
            this.employees = data;
            for (let employee of data) {
                this.employeesService.getCustomers(employee.id).subscribe(
                    (data) => {
                        console.log(employee.id);
                        this.customerResults[employee.id] = data.length;
                    },
                    (error) => {console.error("Failed to load Employee list", error);});
            }

        },
        (error) => {console.error("Failed to load Employee list", error);});
    }
}
