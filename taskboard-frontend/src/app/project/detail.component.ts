import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService, ProjectDTO, TaskDTO, TaskCreateDTO } from '../services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="project-detail-container">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Projects
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <p>Loading project...</p>
      </div>

      <!-- Main Content -->
      <div *ngIf="!loading && project" class="content">
        <!-- Project Info -->
        <div class="project-info">
          <h1>{{ project.name }}</h1>
          <p *ngIf="project.description" class="description">{{ project.description }}</p>
          <p *ngIf="!project.description" class="description empty">No description provided</p>
        </div>

        <!-- Tasks Section -->
        <div class="tasks-section">
          <div class="section-header">
            <h2>Tasks</h2>
            <button class="create-task-btn" (click)="toggleTaskForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Task
            </button>
          </div>

          <!-- Create Task Form -->
          <div *ngIf="showTaskForm" class="task-form-card">
            <h3>Create New Task</h3>
            <form (ngSubmit)="createTask()">
              <div class="form-group">
                <label>Task Title <span class="required">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="newTask.title" 
                  name="title"
                  required
                  placeholder="Enter task title"
                  [class.input-error]="taskError">
              </div>

              <div class="form-group">
                <label>Status <span class="required">*</span></label>
                <select [(ngModel)]="newTask.status" name="status" required>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div *ngIf="taskError" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ taskError }}</span>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-cancel" (click)="cancelTaskForm()">Cancel</button>
                <button type="submit" class="btn-submit" [disabled]="creatingTask || !newTask.title">
                  <span *ngIf="!creatingTask">Create Task</span>
                  <span *ngIf="creatingTask" class="loading-spinner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Tasks List -->
          <div *ngIf="tasks.length === 0 && !showTaskForm" class="empty-tasks">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p>No tasks yet. Create your first task to get started!</p>
          </div>

          <div *ngIf="tasks.length > 0" class="tasks-grid">
            <!-- To Do Column -->
            <div class="task-column">
              <h3 class="column-header todo">
                <span class="status-dot"></span>
                To Do
                <span class="task-count">{{ getTasksByStatus('TODO').length }}</span>
              </h3>
              <div class="task-list">
                <div *ngFor="let task of getTasksByStatus('TODO')" class="task-card">
                  <div class="task-header">
                    <h4>{{ task.title }}</h4>
                    <button class="delete-btn" (click)="deleteTask(task.id!)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="task-actions">
                    <button class="status-btn" (click)="updateTaskStatus(task.id!, 'IN_PROGRESS')">
                      Move to In Progress →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- In Progress Column -->
            <div class="task-column">
              <h3 class="column-header in-progress">
                <span class="status-dot"></span>
                In Progress
                <span class="task-count">{{ getTasksByStatus('IN_PROGRESS').length }}</span>
              </h3>
              <div class="task-list">
                <div *ngFor="let task of getTasksByStatus('IN_PROGRESS')" class="task-card">
                  <div class="task-header">
                    <h4>{{ task.title }}</h4>
                    <button class="delete-btn" (click)="deleteTask(task.id!)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="task-actions">
                    <button class="status-btn back" (click)="updateTaskStatus(task.id!, 'TODO')">
                      ← Back to To Do
                    </button>
                    <button class="status-btn" (click)="updateTaskStatus(task.id!, 'DONE')">
                      Complete →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Done Column -->
            <div class="task-column">
              <h3 class="column-header done">
                <span class="status-dot"></span>
                Done
                <span class="task-count">{{ getTasksByStatus('DONE').length }}</span>
              </h3>
              <div class="task-list">
                <div *ngFor="let task of getTasksByStatus('DONE')" class="task-card completed">
                  <div class="task-header">
                    <h4>{{ task.title }}</h4>
                    <button class="delete-btn" (click)="deleteTask(task.id!)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="task-actions">
                    <button class="status-btn back" (click)="updateTaskStatus(task.id!, 'IN_PROGRESS')">
                      ← Reopen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-detail-container {
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
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
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

    .content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .project-info {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 2rem;
    }

    .project-info h1 {
      font-size: 2rem;
      color: #333;
      margin: 0 0 0.75rem 0;
      font-weight: 700;
    }

    .description {
      color: #666;
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0;
    }

    .description.empty {
      color: #999;
      font-style: italic;
    }

    .tasks-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
      font-weight: 600;
    }

    .create-task-btn {
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

    .create-task-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .task-form-card {
      background: #f8f9ff;
      padding: 1.5rem;
      border-radius: 12px;
      border: 2px solid #e0e4ff;
      margin-bottom: 2rem;
    }

    .task-form-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.125rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .required {
      color: #f44336;
    }

    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
      font-family: inherit;
      background: white;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input.input-error {
      border-color: #f44336;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      background: #ffebee;
      padding: 0.75rem;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .btn-cancel, .btn-submit {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
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

    .btn-cancel:hover {
      border-color: #999;
      color: #333;
    }

    .btn-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-spinner svg {
      animation: spin 1s linear infinite;
    }

    .empty-tasks {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
    }

    .empty-tasks svg {
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-tasks p {
      color: #666;
      font-size: 1rem;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .task-column {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 1rem;
    }

    .column-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      padding: 0.75rem;
      margin: 0 0 1rem 0;
      border-radius: 8px;
    }

    .column-header.todo {
      background: #e3f2fd;
      color: #1976d2;
    }

    .column-header.in-progress {
      background: #fff3e0;
      color: #f57c00;
    }

    .column-header.done {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }

    .task-count {
      margin-left: auto;
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      transition: all 0.2s ease;
    }

    .task-card:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .task-card.completed {
      opacity: 0.8;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.75rem;
    }

    .task-card h4 {
      margin: 0;
      color: #333;
      font-size: 0.95rem;
      font-weight: 500;
      flex: 1;
    }

    .delete-btn {
      padding: 0.25rem;
      background: transparent;
      border: none;
      color: #999;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .delete-btn:hover {
      background: #ffebee;
      color: #f44336;
    }

    .task-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .status-btn {
      padding: 0.5rem 0.75rem;
      background: #f0f0f0;
      border: none;
      border-radius: 6px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-btn:hover {
      background: #667eea;
      color: white;
    }

    .status-btn.back:hover {
      background: #999;
    }

    @media (max-width: 1024px) {
      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
      }

      .content {
        padding: 1.5rem 1rem;
      }

      .project-info, .tasks-section {
        padding: 1.5rem;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .create-task-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: ProjectDTO | null = null;
  tasks: TaskDTO[] = [];
  loading = false;
  showTaskForm = false;
  creatingTask = false;
  taskError = '';
  
  newTask: TaskCreateDTO = {
    title: '',
    status: 'TODO'
  };

  projectId!: number;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.loadProject();
      this.loadTasks();
    });
  }

  loadProject(): void {
    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  loadTasks(): void {
    this.projectService.getAllTasks().subscribe({
      next: (allTasks) => {
        this.tasks = allTasks.filter(task => task.projectId === this.projectId);
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  toggleTaskForm(): void {
    this.showTaskForm = !this.showTaskForm;
    if (!this.showTaskForm) {
      this.resetTaskForm();
    }
    this.cdRef.markForCheck();
  }

  cancelTaskForm(): void {
    this.showTaskForm = false;
    this.resetTaskForm();
    this.cdRef.markForCheck();
  }

  resetTaskForm(): void {
    this.newTask = {
      title: '',
      status: 'TODO'
    };
    this.taskError = '';
  }

  createTask(): void {
    if (!this.newTask.title.trim()) {
      this.taskError = 'Task title is required';
      this.cdRef.markForCheck();
      return;
    }

    this.creatingTask = true;
    this.taskError = '';

    this.projectService.createTask(this.projectId, this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.creatingTask = false;
        this.showTaskForm = false;
        this.resetTaskForm();
        this.cdRef.markForCheck();
      },
      error: (error) => {
        this.creatingTask = false;
        this.taskError = 'Failed to create task. Please try again.';
        console.error('Error creating task:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  getTasksByStatus(status: string): TaskDTO[] {
    return this.tasks.filter(task => task.status === status);
  }

  updateTaskStatus(taskId: number, newStatus: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updateData: TaskCreateDTO = {
      title: task.title,
      status: newStatus
    };

    this.projectService.updateTask(taskId, updateData).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.projectService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== taskId);
          this.cdRef.markForCheck();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.cdRef.markForCheck();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}