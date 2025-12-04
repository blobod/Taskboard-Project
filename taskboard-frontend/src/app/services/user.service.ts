import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDTO {
  id?: number;
  username: string;
  email: string;
  // Add other fields from your User DTO
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users'; // Adjust to your endpoint

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.baseUrl, user, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}