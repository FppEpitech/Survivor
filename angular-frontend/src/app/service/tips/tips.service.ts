import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tip {
  id?: number;
  title: string;
  tip: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  private apiUrl = 'api/tips';

  constructor(private http: HttpClient) {}

  // Get all tips
  getTips(): Observable<Tip[]> {
    return this.http.get<Tip[]>(`${this.apiUrl}/`);
  }

  // Get a single tip by ID
  getTip(id: number): Observable<Tip> {
    return this.http.get<Tip>(`${this.apiUrl}/${id}`);
  }

  // Create a new tip
  createTip(tip: Tip): Observable<Tip> {
    return this.http.post<Tip>(`${this.apiUrl}/`, tip, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Update an existing tip by ID
  updateTip(id: number, tip: Tip): Observable<Tip> {
    return this.http.put<Tip>(`${this.apiUrl}/${id}`, tip, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Delete a tip by ID
  deleteTip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
