import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  signUp(payload: { name: string; birthdate: string; email: string; password: string }): Observable<any> {
    console.log('Payload inviato:', payload);
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  login(payload: { email: string; password: string }): Observable<ApiResponse<{ id: string; name: string; email: string }>> {
    return this.http.post<ApiResponse<{ id: string; name: string; email: string }>>(
      `${this.baseUrl}/login`,
      payload
    );
  }

  verifyEmail(token: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/verify?token=${token}`);
  }

  resendEmail(oldToken: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/resend-token`, { oldToken });
  }

}
