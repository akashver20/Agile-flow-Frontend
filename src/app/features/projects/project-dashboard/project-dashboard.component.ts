import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { ProjectsService } from '../projects.service';
import { AuthService } from '../../auth/auth.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    CreateProjectModalComponent
  ],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="container">
          <div class="header-content">
            <div class="header-left">
              <div class="logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                  <path d="M8 12H24M8 16H24M8 20H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                      <stop stop-color="#6366f1"/>
                      <stop offset="1" stop-color="#3b82f6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span class="logo-text">TaskFlow</span>
              </div>
            </div>
            <div class="header-right">
              <span class="user-name">{{ currentUser()?.fullName }}</span>
              <app-button variant="ghost" size="sm" (click)="logout()">
                Logout
              </app-button>
            </div>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="container">
          <div class="page-header">
            <div>
              <h1 class="page-title">Projects</h1>
              <p class="page-subtitle">Manage and organize your projects</p>
            </div>
            <app-button variant="primary" (click)="openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Create Project
            </app-button>
          </div>

          <div *ngIf="isLoading()" class="loading-state">
            <div class="spinner"></div>
            <p>Loading projects...</p>
          </div>

          <div *ngIf="!isLoading() && projects().length === 0">
            <app-empty-state
              title="No projects yet"
              description="Create your first project to get started with organizing your tasks"
            >
              <app-button variant="primary" (click)="openCreateModal()">
                Create Your First Project
              </app-button>
            </app-empty-state>
          </div>

          <div *ngIf="!isLoading() && projects().length > 0" class="projects-grid">
            <app-card
              *ngFor="let project of projects()"
              [hoverable]="true"
              (click)="navigateToProject(project.id)"
            >
              <div class="project-card">
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-meta">
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M3 13C3 10.7909 5.23858 9 8 9C10.7614 9 13 10.7909 13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span>{{ project.memberCount }} members</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M5 2V4M11 2V4M3 7H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span>{{ formatDate(project.lastUpdated) }}</span>
                  </div>
                </div>
              </div>
            </app-card>
          </div>
        </div>
      </main>
    </div>

    <app-create-project-modal
      [isOpen]="isCreateModalOpen()"
      (closeModal)="closeCreateModal()"
      (projectCreated)="onProjectCreated()"
    />
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
    }

    .dashboard-header {
      background-color: var(--color-bg-primary);
      border-bottom: 1px solid var(--color-border);
      padding: var(--spacing-lg) 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .logo-text {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }

    .dashboard-main {
      padding: var(--spacing-2xl) 0;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-2xl);
    }

    .page-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .page-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3xl);
      gap: var(--spacing-lg);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }

    .project-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .project-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .project-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .project-meta {
      display: flex;
      gap: var(--spacing-lg);
      margin-top: auto;
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--color-border);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
    }

    .meta-item svg {
      color: var(--color-text-tertiary);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-lg);
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectDashboardComponent implements OnInit {
  projects = signal<Project[]>([]);
  isLoading = signal(false);
  isCreateModalOpen = signal(false);

  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    private router: Router
  ) { }

  get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  onProjectCreated(): void {
    this.closeCreateModal();
    this.loadProjects();
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  logout(): void {
    this.authService.logout();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  }
}
