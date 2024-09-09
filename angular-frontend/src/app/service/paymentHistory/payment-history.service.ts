import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PaymentHistory {
    id: number;
    date: string;
    payment_method: string;
    amount: number;
    comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {
    private apiUrl = `${environment.apiUrl}/paymentHistory`;
    private payments: PaymentHistory[] = [];

    constructor(private http: HttpClient) { }

    async getPayments(): Promise<PaymentHistory[]> {
        try {
            this.payments = await firstValueFrom(this.http.get<PaymentHistory[]>(`${this.apiUrl}`));
        } catch (error) {
            console.error("Failed to load payments list", error);
            this.payments = [];
        }
        return this.payments;
    }

    //Get payment History for a customer
    async getPaymentsCustomer(id: number): Promise<PaymentHistory[]> {
        try {
            this.payments = await firstValueFrom(this.http.get<PaymentHistory[]>(`${this.apiUrl}/customer/${id}`));
        } catch (error) {
            console.error("Failed to load payments list", error);
            this.payments = [];
        }
        return this.payments;
    }
}
