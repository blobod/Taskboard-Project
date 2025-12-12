import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name?: string;
  email: string;
  // Add other user fields from your DTO
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) platformId: Object
) {
  this.isBrowser = isPlatformBrowser(platformId);
  
  // Check if user is already logged in (only in browser)
  if (this.isBrowser) {
    const storedUser = localStorage.getItem('currentUser');
    // Check for both null and the string "undefined"
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }
}

login(credentials: LoginRequest): Observable<AuthResponse> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, { headers }).pipe(
    tap(response => {
      if (this.isBrowser) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (this.isBrowser) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
      return throwError(() => ({
        status: error.status,
        statusText: error.statusText,
        message: error.error ?? error.message
      }));
    })
  );
}

register(userData: RegisterRequest): Observable<AuthResponse> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData, { headers }).pipe(
    tap(response => {
      if (this.isBrowser) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      return throwError(() => ({
        status: error.status,
        statusText: error.statusText,
        message: error.error ?? error.message
      }));
    })
  );
}
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}