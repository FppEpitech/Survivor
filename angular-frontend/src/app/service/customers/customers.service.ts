import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  email: string;
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  description: string;
  astrological_sign: string;
  coach_id: number;
}

export interface Clothes {
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private apiUrl = 'api/customers';

  constructor(private http: HttpClient) {}

  // Get all Customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/`);
  }

  // Get a single Customer by ID
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // Create a new Customer
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/`, customer, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Update an existing Customer by ID
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Delete a Customer by ID
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get all Clothes for a Customer by ID
  getCustomerClothes(id: number): Observable<Clothes[]> {
    return this.http.get<any>(`${this.apiUrl}/${id}/clothes`);
  }
}
