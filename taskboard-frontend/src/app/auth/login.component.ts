import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login to Taskboard</h2>
        
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>E-mail</label>
            <input 
              type="text" 
              [(ngModel)]="email" 
              name="email"
              required
              placeholder="Enter e-mail"
              [class.input-error]="errorMessage">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              required
              placeholder="Enter password"
              [class.input-error]="errorMessage">
          </div>

          <div *ngIf="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <button type="submit" [disabled]="loading || !email || !password">
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading" class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Logging in...
            </span>
          </button>
        </form>

        <p class="register-link">
          Don't have an account? <a [routerLink]="['/register']">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 420px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h2 {
      margin-bottom: 2rem;
      text-align: center;
      color: #333;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input.input-error {
      border-color: #f44336;
    }

    input.input-error:focus {
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 0.875rem;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.9rem;
      animation: shake 0.3s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .error-message svg {
      flex-shrink: 0;
    }

    button {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 1.5rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .loading-spinner svg {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
      font-size: 0.95rem;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
    
  ) {}

onLogin() {
  if (!this.email || !this.password) {
    this.errorMessage = 'Please enter both e-mail and password';
    this.cdRef.detectChanges();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.authService.login({ email: this.email, password: this.password }).subscribe({
    next: (response) => {
      this.loading = false;
      console.log('Login successful:', response);
      this.router.navigate(['/home']); // adjust to main page (future thing)
    },
    error: (error) => {
        this.loading = false;
        console.error('Login failed:', error);

        if (error?.status === 401 || error?.status === 403) {
          this.errorMessage = 'Invalid e-mail or password. Please try again.';
        } else if (error?.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error?.status === 404) {
          this.errorMessage = 'User not found. Please check your e-mail.';
        } else {
          this.errorMessage = (error?.message?.message) || (error?.message) || 'An error occurred. Please try again later.';
        }
        this.cdRef.markForCheck(); 
      }
    });
  }
}