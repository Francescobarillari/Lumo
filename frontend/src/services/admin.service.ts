import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users`);
    }

    getAllEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.baseUrl}/events`);
    }

    approveEvent(id: number): Observable<Event> {
        return this.http.post<Event>(`${this.baseUrl}/events/${id}/approve`, {});
    }

    rejectEvent(id: number, reason?: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/events/${id}/reject`, { reason });
    }

    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/events/${id}`);
    }
}
