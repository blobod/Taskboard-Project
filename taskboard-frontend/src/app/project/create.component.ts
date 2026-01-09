import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService, ProjectCreateDTO } from '../services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-project-container">
      <div class="header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          <h1>Create New Project</h1>
          <div style="width: 80px;"></div>
        </div>
      </div>

      <div class="content">
        <div class="form-card">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Project Name <span class="required">*</span></label>
              <input 
                type="text" 
                [(ngModel)]="name" 
                name="name"
                required
                placeholder="Enter project name"
                [class.input-error]="errorMessage">
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea 
                [(ngModel)]="description" 
                name="description"
                rows="4"
                placeholder="Enter project description (optional)"
                [class.input-error]="errorMessage"></textarea>
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

            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="goBack()" [disabled]="loading">
                Cancel
              </button>
              <button type="submit" class="btn-submit" [disabled]="loading || !name">
                <span *ngIf="!loading">Create Project</span>
                <span *ngIf="loading" class="loading-spinner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Creating...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-project-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .header-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .back-btn:hover {
      border-color: #667eea;
      color: #667eea;
      background: #f8f9ff;
    }

    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .required {
      color: #f44336;
    }

    input, textarea {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input.input-error, textarea.input-error {
      border-color: #f44336;
    }

    input.input-error:focus, textarea.input-error:focus {
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 0.875rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
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
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
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

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-cancel,
    .btn-submit {
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-cancel {
      background: white;
      border: 2px solid #e0e0e0;
      color: #666;
    }

    .btn-cancel:hover:not(:disabled) {
      border-color: #999;
      color: #333;
    }

    .btn-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 150px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-cancel:disabled,
    .btn-submit:disabled {
      opacity: 0.6;
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

    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
      }

      h1 {
        font-size: 1.25rem;
      }

      .content {
        padding: 1.5rem 1rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-cancel,
      .btn-submit {
        width: 100%;
      }
    }
  `]
})
export class CreateProjectComponent {
  name = '';
  description = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (!this.name.trim()) {
      this.errorMessage = 'Project name is required';
      this.cdRef.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const projectData: ProjectCreateDTO = {
      name: this.name.trim(),
      description: this.description.trim()
    };

    this.projectService.createProject(projectData).subscribe({
      next: (project) => {
        this.loading = false;
        this.successMessage = 'Project created successfully!';
        console.log('Project created:', project);
        this.cdRef.markForCheck();
        
        setTimeout(() => {
          this.router.navigate(['/projects', project.id]);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to create project. Please try again.';
        console.error('Error creating project:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}