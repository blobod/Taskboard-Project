import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectDTO {
  id?: number;
  name: string;
  description?: string;
  ownerId?: number;
  taskIds?: number[];
}

export interface ProjectCreateDTO {
  name: string;
  description?: string;
}

export interface TaskDTO {
  id?: number;
  title: string;
  status: string;
  projectId?: number;
  assigneeId?: number;
}

export interface TaskCreateDTO {
  title: string;
  status: string;
  assigneeId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Project methods
  getAllProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${this.baseUrl}/projects`);
  }

  getProjectById(id: number): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(project: ProjectCreateDTO): Observable<ProjectDTO> {
    return this.http.post<ProjectDTO>(`${this.baseUrl}/projects`, project);
  }

  updateProject(id: number, project: ProjectCreateDTO): Observable<ProjectDTO> {
    return this.http.put<ProjectDTO>(`${this.baseUrl}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }

  // Task methods
  getAllTasks(): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.baseUrl}/tasks`);
  }

  getTaskById(id: number): Observable<TaskDTO> {
    return this.http.get<TaskDTO>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(projectId: number, task: TaskCreateDTO): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(`${this.baseUrl}/tasks/project/${projectId}`, task);
  }

  updateTask(id: number, task: TaskCreateDTO): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }
}