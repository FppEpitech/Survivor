import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Clothe {
  old_id: number;
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClothesService {
  private apiUrl = `${environment.apiUrl}/clothes`;

  constructor(private http: HttpClient) {}

  // Get all Clothes
  getClothes() {
    return this.http.get<Clothe[]>(`${this.apiUrl}/`);
  }

  // Get a single Clothe by ID
  getClothe(id: number) {
    return this.http.get<Clothe>(`${this.apiUrl}/${id}`);
  }

  // Create a new Clothe
  createClothe(clothe: Clothe) {
    return this.http.post<Clothe>(`${this.apiUrl}/`, clothe);
  }

  // Update an existing Clothe by ID
  updateClothe(id: number, clothe: Clothe) {
    return this.http.put<Clothe>(`${this.apiUrl}/${id}`, clothe);
  }

  // Delete a Clothe by ID
  deleteClothe(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
