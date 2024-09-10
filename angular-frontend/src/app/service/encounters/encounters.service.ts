import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
    private encounters: Encounter[] = [];

    constructor(private http: HttpClient) { }

    // Get all Encounters
    async getEncounters(): Promise<Encounter[]> {
        try {
            this.encounters = await firstValueFrom( this.http.get<Encounter[]>(`${this.apiUrl}`));
        } catch (error) {
            console.error("Failed to load encounters list", error);
            this.encounters = [];
        }
        return this.encounters;
    }

    // Get all Encounters of a single customer
    async getCustomerEncounters(id: number): Promise<Encounter[]> {
        try {
            this.encounters = await firstValueFrom(this.http.get<Encounter[]>(`${this.apiUrl}/customer/${id}`));
        } catch (error) {
            console.error("Failed to load encounters list", error);
            this.encounters = [];
        }
        return this.encounters;
    }
}
