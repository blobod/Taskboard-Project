import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectDTO {
  id?: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8080/api/projects'; // Adjust to your endpoint

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getProjectById(id: number): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProject(project: ProjectDTO): Observable<ProjectDTO> {
    return this.http.post<ProjectDTO>(this.baseUrl, project, { headers: this.getHeaders() });
  }

  updateProject(id: number, project: ProjectDTO): Observable<ProjectDTO> {
    return this.http.put<ProjectDTO>(`${this.baseUrl}/${id}`, project, { headers: this.getHeaders() });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}