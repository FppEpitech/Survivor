import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    private apiUrl = 'api/encounters';

    constructor(private http: HttpClient) { }
}
