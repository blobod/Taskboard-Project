import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Create Account</h2>
        
        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Name</label>
            <input 
              type="text" 
              [(ngModel)]="name" 
              name="name"
              required
              placeholder="Enter your name"
              [class.input-error]="errorMessage"
              (input)="clearError()">
            <span class="input-hint">Your full name</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              required
              placeholder="Enter your email"
              [class.input-error]="errorMessage"
              (input)="clearError()">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              required
              placeholder="Create a password"
              [class.input-error]="errorMessage"
              (input)="clearError()">
            <span class="input-hint">At least 6 characters</span>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              required
              placeholder="Confirm your password"
              [class.input-error]="errorMessage || passwordMismatch"
              (input)="checkPasswordMatch()">
            <span *ngIf="passwordMismatch" class="input-hint error">Passwords do not match</span>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <div *ngIf="successMessage" class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{{ successMessage }}</span>
          </div>

          <button type="submit" [disabled]="loading || !isFormValid()">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading" class="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <p class="login-link">
          Already have an account? <a [routerLink]="['/login']">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .register-card {
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

    .input-hint {
      display: block;
      margin-top: 0.375rem;
      font-size: 0.85rem;
      color: #888;
    }

    .input-hint.error {
      color: #f44336;
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

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4caf50;
      background: #e8f5e9;
      padding: 0.875rem;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.9rem;
      animation: slideIn 0.3s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .error-message svg,
    .success-message svg {
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

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
      font-size: 0.95rem;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  passwordMismatch = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  isFormValid(): boolean {
    return !!(
      this.name &&
      this.email &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword &&
      this.password.length >= 6 &&
      this.name.length >= 2
    );
  }

  checkPasswordMatch(): void {
    if (this.confirmPassword) {
      this.passwordMismatch = this.password !== this.confirmPassword;
      this.cdRef.markForCheck();
    }
  }

  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
      this.cdRef.markForCheck();
    }
  }

  onRegister(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all fields correctly';
      this.cdRef.markForCheck();
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.cdRef.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Account created successfully! Redirecting...';
        console.log('Registration successful:', response);
        
        this.cdRef.markForCheck();
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration failed:', error);

        if (error?.status === 409) {
          this.errorMessage = 'Username or email already exists';
        } else if (error?.status === 400) {
          this.errorMessage = error?.error?.message || 'Invalid registration data';
        } else if (error?.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          this.errorMessage = error?.error?.message || error?.message || 'Registration failed. Please try again.';
        }
        
        this.cdRef.markForCheck();
      }
    });
  }
}