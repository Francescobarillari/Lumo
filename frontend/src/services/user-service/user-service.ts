import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?q=${query}`);
  }

  toggleSavedEvent(userId: string, eventId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/saved-events/${eventId}`, {});
  }

  followUser(followerId: string, followedId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${followerId}/follow/${followedId}`, {});
  }

  unfollowUser(followerId: string, followedId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${followerId}/follow/${followedId}`);
  }

  isFollowing(followerId: string, followedId: string): Observable<{ isFollowing: boolean }> {
    return this.http.get<{ isFollowing: boolean }>(`${this.apiUrl}/${followerId}/is-following/${followedId}?t=${new Date().getTime()}`);
  }

  getFollowers(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/followers`);
  }

  getFollowing(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/following`);
  }

  updateUser(userId: string, data: { name?: string, email?: string, description?: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/password`, { oldPassword, newPassword });
  }

  private userUpdated = new Subject<void>();
  userUpdates$ = this.userUpdated.asObservable();

  notifyUserUpdate() {
    this.userUpdated.next();
  }
}
