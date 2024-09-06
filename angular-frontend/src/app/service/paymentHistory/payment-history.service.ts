import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
        private apiUrl = 'api/paymentHistory';

    constructor(private http: HttpClient) { }

    getPayments(): Observable<PaymentHistory[]> {
        return this.http.get<PaymentHistory[]>(`${this.apiUrl}`);
    }

    //Get payment History for a customer
    getPaymentsCustomer(id: number): Observable<PaymentHistory[]> {
        return this.http.get<PaymentHistory[]>(`${this.apiUrl}/customer/${id}`);
    }
}
