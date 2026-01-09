import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProjectService, ProjectDTO, TaskDTO } from '../services/project.service';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <h1 class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Taskboard
          </h1>
          <div class="header-right">
            <span class="user-name">Welcome, {{ currentUser?.name || 'User' }}</span>
            <button class="logout-btn" (click)="onLogout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="welcome-section">
          <h2>Your Workspace</h2>
          <p>Manage your projects and tasks efficiently</p>
        </div>

        <!-- Action Cards -->
        <div class="action-grid">
          <!-- Projects Card -->
          <div class="action-card projects-card">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Projects</h3>
            <p>Organize your work into projects</p>
            <div class="card-stats">
              <div class="stat">
                <span class="stat-number">{{ activeProjects }}</span>
                <span class="stat-label">Active</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ completedProjects }}</span>
                <span class="stat-label">Completed</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-primary" (click)="createProject()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Project
              </button>
              <button class="btn-secondary" (click)="viewProjects()">
                View All
              </button>
            </div>
          </div>

          <!-- Tasks Card -->
          <div class="action-card tasks-card">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>Tasks</h3>
            <p>Keep track of your todos</p>
            <div class="card-stats">
              <div class="stat">
                <span class="stat-number">{{ pendingTasks }}</span>
                <span class="stat-label">Pending</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ doneTasks }}</span>
                <span class="stat-label">Done</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-primary" (click)="createTask()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Task
              </button>
              <button class="btn-secondary" (click)="viewTasks()">
                View All
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Stats Section -->
        <div class="quick-stats">
          <div class="stat-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div>
              <div class="stat-value">{{ todayTasks }}</div>
              <div class="stat-title">Tasks Today</div>
            </div>
          </div>
          <div class="stat-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <div class="stat-value">{{ completionRate }}%</div>
              <div class="stat-title">Completion Rate</div>
            </div>
          </div>
          <div class="stat-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <div>
              <div class="stat-value">{{ activeProjects }}</div>
              <div class="stat-title">Active Projects</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    /* Header */
    .header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      margin: 0;
    }

    .logo svg {
      color: #667eea;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-name {
      color: #555;
      font-weight: 500;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .logout-btn:hover {
      background: #ffe0e0;
      border-color: #ffcccc;
      color: #d32f2f;
    }

    /* Main Content */
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-section {
      margin-bottom: 3rem;
      text-align: center;
    }

    .welcome-section h2 {
      font-size: 2.25rem;
      color: #333;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .welcome-section p {
      font-size: 1.125rem;
      color: #666;
    }

    /* Action Grid */
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .action-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .card-icon {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .projects-card .card-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .tasks-card .card-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .action-card h3 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .action-card p {
      color: #666;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }

    .card-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
      padding: 1rem 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #888;
      margin-top: 0.25rem;
    }

    .card-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-primary,
    .btn-secondary {
      flex: 1;
      padding: 0.875rem 1.25rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: white;
      border: 2px solid #e0e0e0;
      color: #666;
    }

    .btn-secondary:hover {
      border-color: #667eea;
      color: #667eea;
      background: #f8f9ff;
    }

    /* Quick Stats */
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-box {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-box svg {
      color: #667eea;
      flex-shrink: 0;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
    }

    .stat-title {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.25rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
      }

      .user-name {
        display: none;
      }

      .main-content {
        padding: 1.5rem 1rem;
      }

      .welcome-section h2 {
        font-size: 1.75rem;
      }

      .action-grid {
        grid-template-columns: 1fr;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  projects: ProjectDTO[] = [];
  tasks: TaskDTO[] = [];
  
  // Computed stats
  activeProjects = 0;
  completedProjects = 0;
  pendingTasks = 0;
  doneTasks = 0;
  todayTasks = 0;
  completionRate = 0;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdRef.markForCheck();
    });
    
    this.loadStats();
  }

  loadStats(): void {
    // Load projects
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.calculateProjectStats();
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });

    // Load tasks
    this.projectService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateTaskStats();
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  calculateProjectStats(): void {
    // For now, count all projects as active
    // You can add a 'completed' field to Project later
    this.activeProjects = this.projects.length;
    this.completedProjects = 0;
  }

  calculateTaskStats(): void {
    this.pendingTasks = this.tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
    this.doneTasks = this.tasks.filter(t => t.status === 'DONE').length;
    this.todayTasks = this.tasks.filter(t => t.status !== 'DONE').length;
    
    const totalTasks = this.tasks.length;
    this.completionRate = totalTasks > 0 ? Math.round((this.doneTasks / totalTasks) * 100) : 0;
  }
  createProject(): void {
    this.router.navigate(['/projects/create']);
    // TODO: Navigate to create project page or open modal
  }

  viewProjects(): void {
    this.router.navigate(['/projects']);
    // TODO: Navigate to projects list page
  }

  createTask(): void {
    console.log('Create task clicked');
    // TODO: Navigate to create task page or open modal
  }

  viewTasks(): void {
    console.log('View tasks clicked');
    // TODO: Navigate to tasks list page
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}