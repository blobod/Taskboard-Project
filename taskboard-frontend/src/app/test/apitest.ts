import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Projects Test</h1>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">Error: {{ error }}</div>
    <ul>
      <li *ngFor="let project of projects">
        {{ project.name }} - {{ project.description }}
      </li>
    </ul>
  `
})
export class ApitestComponent implements OnInit {
  projects: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
        console.log('Projects loaded:', data);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error('Error loading projects:', err);
      }
    });
  }
}