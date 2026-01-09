import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ProjectService, ProjectDTO } from '../services/project.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="projects-container">
      <div class="header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </button>
          <h1>My Projects</h1>
          <button class="create-btn" (click)="goToCreateProject()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Project
          </button>
        </div>
      </div>

      <div class="content">
        <div *ngIf="loading" class="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <p>Loading projects...</p>
        </div>

        <div *ngIf="!loading && projects.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2>No projects yet</h2>
          <p>Create your first project to get started</p>
          <button class="create-btn-large" (click)="goToCreateProject()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Project
          </button>
        </div>

        <div *ngIf="!loading && projects.length > 0" class="projects-grid">
          <div *ngFor="let project of projects" class="project-card" (click)="viewProject(project.id!)">
            <div class="project-header">
              <h3>{{ project.name }}</h3>
              <div class="project-actions" (click)="$event.stopPropagation()">
                <button class="icon-btn" (click)="deleteProject(project.id!, $event)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p class="project-description">{{ project.description || 'No description' }}</p>
            <div class="project-footer">
              <div class="task-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>{{ project.taskIds?.length || 0 }} tasks</span>
              </div>
              <button class="view-btn" (click)="viewProject(project.id!); $event.stopPropagation()">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
      margin: 0;
      flex: 1;
      text-align: center;
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

    .create-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .create-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: #667eea;
    }

    .loading svg {
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading p {
      color: #666;
      font-size: 1rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state svg {
      color: #ccc;
      margin-bottom: 1.5rem;
    }

    .empty-state h2 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
    }

    .create-btn-large {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
      font-weight: 500;
    }

    .create-btn-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.75rem;
    }

    .project-card h3 {
      font-size: 1.25rem;
      color: #333;
      margin: 0;
      font-weight: 600;
      flex: 1;
    }

    .project-actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-btn {
      padding: 0.375rem;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #999;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-btn:hover {
      background: #ffebee;
      color: #f44336;
    }

    .project-description {
      color: #666;
      margin-bottom: 1.5rem;
      flex: 1;
      line-height: 1.5;
    }

    .project-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }

    .task-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #888;
      font-size: 0.9rem;
    }

    .task-count svg {
      color: #667eea;
    }

    .view-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      background: #f8f9ff;
      border: 1px solid #e0e4ff;
      border-radius: 6px;
      color: #667eea;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .view-btn:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
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

      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsListComponent implements OnInit {
  projects: ProjectDTO[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    
    // Reload projects when navigating back to this route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/projects') {
        this.loadProjects();
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup is handled automatically by Angular
  }

  ionViewWillEnter(): void {
    // Reload projects when navigating back
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load projects. Please try again.';
        console.error('Error loading projects:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  goToCreateProject(): void {
    this.router.navigate(['/projects/create']);
  }

  viewProject(id: number): void {
    this.router.navigate(['/projects', id]);
  }

  deleteProject(id: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this project? This will also delete all tasks in the project.')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== id);
          this.cdRef.markForCheck();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete project. Please try again.';
          console.error('Error deleting project:', error);
          this.cdRef.markForCheck();
        }
      });
    }
  }
}