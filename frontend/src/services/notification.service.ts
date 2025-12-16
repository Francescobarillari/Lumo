
export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'APPROVED' | 'REJECTED' | 'FOLLOWUP';
    isRead: boolean;
    createdAt: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';

    constructor(private http: HttpClient) { }

    getNotifications(userId: number | string): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}?userId=${userId}`);
    }

    markAsRead(notificationId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${notificationId}/read`, {});
    }

    markAllAsRead(userId: number | string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/read-all?userId=${userId}`, {});
    }
}
