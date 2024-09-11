import { Component } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.scss']
})
export class DeleteEmployeeComponent {

  employees: Employee[] = [];
  employeeToDelete?: Employee;

  employeeImageUrl?: string;

  backupImageUrl = 'assets/placeholder-128.png';
  apiUrl = environment.apiUrl + '/';

  confirmDeleting = false;

  constructor (
    private employeesService : EmployeesService
  ) {}

  async ngOnInit() {
    this.employees = await this.employeesService.getEmployees();
  }

  employeeSelected(employee: Employee) {
    this.employeeToDelete = employee;
    this.employeeImageUrl = this.apiUrl + this.employeeToDelete.image_url;
    console.log(this.employeeToDelete);
  }

  deleteEmployee() {
    this.confirmDeleting = true;
  }

  onImageError(event: any) {
    event.target.src = this.backupImageUrl;
  }

  confirmDeleteEmployee() {
    console.log('Deleting employee', this.employeeToDelete);
    if (this.employeeToDelete) {
      this.employeesService.deleteEmployee(this.employeeToDelete.id);
    }
    this.employeeToDelete = undefined;
    this.confirmDeleting = false;
  }

  cancelDeleteEmployee() {
    this.confirmDeleting = false;
  }

}
