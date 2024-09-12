import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  coach_favorite: boolean;
  image_url: string;
}

export interface Clothes {
  type: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
    private apiUrl = `${environment.apiUrl}/customers`;
    private customers: Customer[] = [];
    private clothes: Clothes[] = [];
    private customer?: Customer;

    constructor(private http: HttpClient) {}

    // Get all Customers
    async getCustomers(): Promise<Customer[]> {
        try {
            this.customers = await firstValueFrom(this.http.get<Customer[]>(`${this.apiUrl}/`));
        } catch (error) {
            console.error("Failed to load customers list", error);
            this.customers = [];
        }
        return this.customers;
    }

    // Get a single Customer by ID
    async getCustomer(id: number): Promise<Customer | undefined> {
        try {
            this.customer = await firstValueFrom(this.http.get<Customer>(`${this.apiUrl}/${id}`));
        } catch (error) {
            console.error("Failed to load customer by id", error);
            this.customer = undefined;
        }
        return this.customer;
    }

    // Create a new Customer
    async createCustomer(customer: Customer): Promise<Customer | undefined> {
        try {
            this.customer = await firstValueFrom(this.http.post<Customer>(`${this.apiUrl}/`, customer, {headers: new HttpHeaders({'Content-Type': 'application/json'})}));
        } catch (error) {
            console.error("Failed to create customer", error);
            this.customer = undefined;
        }
        return this.customer;
    }

    // Update an existing Customer by ID
    async updateCustomer(id: number, customer: Customer): Promise<Customer | undefined> {
        try {
            this.customer = await firstValueFrom(this.http.put<Customer>(`${this.apiUrl}/${id}`, customer, {headers: new HttpHeaders({'Content-Type': 'application/json'})}));
        } catch (error) {
            console.error("Failed to update customer", error);
            this.customer = undefined;
        }
        return this.customer;
    }

    // Delete a Customer by ID
    async deleteCustomer(id: number): Promise<void> {
        try {
            await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
        } catch (error) {
            console.error("Failed to delete customer", error);
        }
    }

    // Get all Clothes for a Customer by ID
    async getCustomerClothes(id: number): Promise<Clothes[]> {
        try {
            this.clothes = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}/clothes`));
        } catch (error) {
            console.error("Failed to update customer", error);
            this.clothes = [];
        }
        return this.clothes;
    }
}
