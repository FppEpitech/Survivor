import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  email: string;
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  work: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = 'api/employees';

  constructor(private http: HttpClient) {}

  // Get all Employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/`);
  }

  // Get a single Employee by ID
  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Create a new Employee
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/`, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Update an existing Employee by ID
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Delete a Employee by ID
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}