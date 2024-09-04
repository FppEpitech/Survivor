import { Component } from '@angular/core';
import { Charts } from './component/charts/charts/charts.component';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [Charts, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsPageComponent {

  employees:Employee[] = [];
  employee?: Employee;

  constructor(private employeesService : EmployeesService) { }

  ngOnInit(): void {
    this.employeesService.getEmployees().subscribe(
      (data) => {this.employees = data},
      (error) => {console.error("Failed to load Employee list", error);});
  }

}
