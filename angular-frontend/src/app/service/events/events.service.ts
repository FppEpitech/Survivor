import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Event {
  old_id: number;
  id: number;
  name: string;
  date: string;
  max_participants: number;
  location_x: string;
  location_y: string;
  type: string;
  employee_id: number;
  location_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'api/events';

  constructor(private http : HttpClient) { }

  // Get all Events
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('api/events');
  }

  // Get a single Event by ID
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`api/events/${id}`);
  }

  // Create a new Event
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`api/events/`, event);
  }

  // Update an existing Event by ID
  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`api/events/${id}`, event);
  }

  // Delete an Event by ID
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`api/events/${id}`);
  }
}
