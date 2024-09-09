import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    constructor(private http: HttpClient) { }

    //Get payment History for a customer
    getPayments(id: number): Observable<PaymentHistory[]> {
        return this.http.get<PaymentHistory[]>(`${this.apiUrl}/customer/${id}`);
    }
}
