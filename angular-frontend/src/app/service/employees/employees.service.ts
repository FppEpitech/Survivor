import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Customer } from '../customers/customers.service';
import { environment } from 'src/environments/environment';

export interface Employee {
  id: number;
  email: string;
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  work: string;
  last_login: string;
  image_url: string;
  customerCount?: number;
}

export interface EmployeeCreation {
    email: string;
    name: string;
    surname: string;
    birth_date: string;
    gender: string;
    work: string;
    password: string;
    image_url: string;
  }

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = `${environment.apiUrl}/employees`;

  private employees: Employee[] = [];
  private customers: Customer[] = [];
  private employee?: Employee;

  constructor(private http: HttpClient) {}

    // Get all Employees
    async getEmployees(): Promise<Employee[]> {
        try {
            this.employees = await firstValueFrom(this.http.get<Employee[]>(`${this.apiUrl}/`));
        } catch (error) {
            console.error("Failed to load Employees list", error);
            this.employees = [];
        }
        return this.employees;
    }

    // Get a single Employee by ID
    async getEmployee(id: number): Promise<Employee | undefined> {;
        try {
            this.employee = await firstValueFrom(this.http.get<Employee>(`${this.apiUrl}/${id}`));
        } catch (error) {
            console.error("Failed to load employee with id", error);
            this.employee = undefined;
        }
        return this.employee;
    }

    // Get me
    async getMe(): Promise<Employee | undefined> {;
        try {
            this.employee = await firstValueFrom(this.http.get<Employee>(`${this.apiUrl}/me`));
        } catch (error) {
            console.error("Failed to load employee Me", error);
            this.employee = undefined;
        }
        return this.employee;
    }

    // Get the customers of an Employee
    async getCustomers(id: number): Promise<Customer[]> {
        try {
            this.customers = await firstValueFrom(this.http.get<Customer[]>(`${this.apiUrl}/customers/${id}`));
        } catch (error) {
            console.error("Failed to load customers list", error);
            this.customers = [];
        }
        return this.customers;
    }

    // Create a new Employee
    async createEmployee(employee: EmployeeCreation): Promise<Employee | undefined> {
        try {
            this.employee = await firstValueFrom(this.http.post<Employee>(`${this.apiUrl}/`, employee, { headers: new HttpHeaders({'Content-Type': 'application/json'})}));
        } catch (error) {
            console.error("Failed to create employee", error);
            this.employee = undefined;
        }
        return this.employee;
    }

    // Update an existing Employee by ID
    async updateEmployee(id: number, employee: Employee): Promise<Employee | undefined> {
        try {
            this.employee = await firstValueFrom(this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, {headers: new HttpHeaders({'Content-Type': 'application/json'})}));
        } catch (error) {
            console.error("Failed to create employee", error);
            this.employee = undefined;
        }
        return this.employee;
    }

    // Delete a Employee by ID
    async deleteEmployee(id: number): Promise<void> {
        try {
            await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
        } catch (error) {
            console.error("Failed to delete employee", error);
        }
    }
}
