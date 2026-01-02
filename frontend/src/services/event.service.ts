import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({ providedIn: 'root' })
export class EventService {
  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

  getEvents(userId?: string): Observable<Event[]> {
    let url = this.baseUrl;
    if (userId && userId !== 'undefined' && userId !== 'null' && !isNaN(Number(userId))) {
      url += `?userId=${userId}`;
    }
    return this.http.get<Event[]>(url);
  }

  getOrganizedEvents(userId: string | number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organized?userId=${userId}`);
  }

  getJoinedEvents(userId: string | number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/joined?userId=${userId}`);
  }

  toggleSavedEvent(userId: string, eventId: number): Observable<{ isSaved: boolean }> {
    return this.http.post<{ isSaved: boolean }>(`http://localhost:8080/api/users/${userId}/saved-events/${eventId}`, {});
  }

  // Utility per futuro: ottenere singolo evento
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  // ✅ Ricerca eventi
  // ✅ Ricerca eventi
  searchEvents(query: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/search?q=${query}`);
  }

  requestParticipation(eventId: number, userId: string | number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${eventId}/participation-request?userId=${userId}`, {});
  }

  acceptParticipation(eventId: number, userId: string | number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${eventId}/participants/${userId}/accept`, {});
  }

  rejectParticipation(eventId: number, userId: string | number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${eventId}/participants/${userId}/reject`, {});
  }
}
