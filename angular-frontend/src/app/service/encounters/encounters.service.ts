import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Encounter {
    id: number;
    customer_id: number;
    date: string;
    rating: number;
    comment: string;
    source: string;
}

@Injectable({
  providedIn: 'root'
})
export class EncountersService {
    private apiUrl = `${environment.apiUrl}/encounters`;

    constructor(private http: HttpClient) { }

    // Get all Encounters
    getEncounters(): Observable<Encounter[]> {
        return this.http.get<Encounter[]>(`${this.apiUrl}`);
    }

    // Get all Encounters of a single customer
    getCustomerEncounters(id: number): Observable<Encounter[]> {
        return this.http.get<Encounter[]>(`${this.apiUrl}/customer/${id}`);
    }
}
