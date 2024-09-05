import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Compatibility {
    sign_customer1: string;
    sign_customer2: string;
    compatibility: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompatibilityService {
    private apiUrl = 'api/compatibility';

    constructor(private http: HttpClient) { }

    //Get compatibility between two customers
    getCompatibility(customer1_id: number, customer2_id: number): Observable<Compatibility> {
        return this.http.get<Compatibility>(`${this.apiUrl}/${customer1_id}/${customer2_id}`);
    }
}
