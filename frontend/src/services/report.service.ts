import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportItem } from '../models/report';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    createReport(payload: FormData): Observable<ReportItem> {
        return this.http.post<ReportItem>(`${this.baseUrl}/reports`, payload);
    }
}
