import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskDTO {
  id?: number;
  title: string;
  description?: string;
  projectId?: number;
  assignedUserId?: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllTasks(): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(this.baseUrl);
  }

  getTaskById(id: number): Observable<TaskDTO> {
    return this.http.get<TaskDTO>(`${this.baseUrl}/${id}`);
  }

  // Updated: Create task for a specific project (assignee = logged user)
  createTask(projectId: number, task: TaskDTO): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(`${this.baseUrl}/project/${projectId}`, task);
  }

  updateTask(id: number, task: TaskDTO): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}