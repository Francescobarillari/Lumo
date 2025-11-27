import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//il file del servizio per la tabella degl'users

export interface User {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

@Component({
  selector: 'app-user-service',
  imports: [],
  template: ``,
  styles: ``,
})

export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }


  @Injectable({
    providedIn: 'root'
  })

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}





