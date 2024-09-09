import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Compatibility {
    customer1AstrologicalSign: string;
    customer2AstrologicalSign: string;
    compatibilityScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompatibilityService {
    private apiUrl = `${environment.apiUrl}/compatibility`;
    private compatibility?: Compatibility;

    constructor(private http: HttpClient) { }

    //Get compatibility between two customers
    async getCompatibility(customer1_id: number, customer2_id: number): Promise<Compatibility | undefined> {
        try {
            this.compatibility = await firstValueFrom(this.http.get<Compatibility>(`${this.apiUrl}/${customer1_id}/${customer2_id}`));
        } catch (error) {
            console.error("Failed to load compatibility", error);
            this.compatibility = undefined;
        }
        return this.compatibility;
    }
}
