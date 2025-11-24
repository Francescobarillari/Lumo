import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  signUp(payload: { name: string; birthdate: string; email: string; password: string }): Observable<ApiResponse<{ token: string }>> {
    console.log('Payload inviato:', payload);
    return this.http.post<ApiResponse<{ token: string }>>(`${this.baseUrl}/signup`, payload);
  }

  login(payload: { email: string; password: string }): Observable<ApiResponse<{ id: string; name: string; email: string }>> {
    return this.http.post<ApiResponse<{ id: string; name: string; email: string }>>(
      `${this.baseUrl}/login`,
      payload
    );
  }

  loginWithGoogle(payload: { idToken: string }): Observable<ApiResponse<{ id: string; name: string; email: string }>> {
    return this.http.post<ApiResponse<{ id: string; name: string; email: string }>>(
      `${this.baseUrl}/login/google`,
      payload
    );
  }

  loginWithGoogleCode(payload: { code: string }): Observable<ApiResponse<{ id: string; name: string; email: string }>> {
    return this.http.post<ApiResponse<{ id: string; name: string; email: string }>>(
      `${this.baseUrl}/login/google/code`,
      payload
    );
  }

  verifyEmail(token: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/verify?token=${token}`);
  }

  resendEmail(payload: { oldToken?: string; email?: string }): Observable<ApiResponse<{ token: string }>> {
    return this.http.post<ApiResponse<{ token: string }>>(`${this.baseUrl}/resend-token`, payload);
  }

}
