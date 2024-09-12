import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface DashboardCustomerStats {
    totalCustomers: number;
    percentageWithEncounter: number;
    averageCustomersPerCoach: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;
    private customerStats?: DashboardCustomerStats;

    constructor(private http: HttpClient) { }

    async getCustomerStats(period: number): Promise<DashboardCustomerStats | undefined> {;
        try {
            this.customerStats = await firstValueFrom(this.http.get<DashboardCustomerStats>(`${this.apiUrl}/customer-stats/${period}`));
        } catch (error) {
            console.error("Failed to load customer Stats", error);
            this.customerStats = undefined;
        }
        return this.customerStats;
    }
}
