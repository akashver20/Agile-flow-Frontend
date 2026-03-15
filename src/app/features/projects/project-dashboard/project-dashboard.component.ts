import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
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
    CreateProjectModalComponent,
    NavbarComponent
  ],
  template: `
    <div class="dashboard">
      <app-navbar>
        <div nav-actions class="nav-user">
          <span class="user-email">{{ currentUser()?.fullName }}</span>
        </div>
      </app-navbar>

      <main class="dashboard-main">
        <div class="container">
          <div class="page-header animate-fade-in" style="opacity: 0">
            <div>
              <h1 class="page-title">My Projects</h1>
              <p class="page-subtitle">{{ projects().length }} project{{ projects().length !== 1 ? 's' : '' }}</p>
            </div>
            <app-button variant="primary" (click)="openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Project
            </app-button>
          </div>

          <div *ngIf="isLoading()" class="loading-state">
            <div class="spinner"></div>
            <p>Loading projects...</p>
          </div>

          <div *ngIf="!isLoading() && projects().length === 0"
               class="empty-box animate-fade-in-up" style="opacity: 0; animation-delay: 0.2s">
            <div class="empty-icon-wrap">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
            </div>
            <p class="empty-title">No projects yet</p>
            <p class="empty-desc">Create your first project to get started</p>
            <app-button variant="primary" (click)="openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Project
            </app-button>
          </div>

          <div *ngIf="!isLoading() && projects().length > 0" class="projects-grid">
            <div *ngFor="let project of projects(); let i = index"
                 class="project-item gradient-card animate-fade-in-up"
                 [style.animation-delay]="(0.1 * i) + 's'"
                 style="opacity: 0"
                 (click)="navigateToProject(project.id)">
              <div class="project-color-bar" [style.background-color]="getProjectColor(i)"></div>
              <h3 class="project-name font-display">{{ project.name }}</h3>
              <p class="project-desc">{{ project.description || 'No description' }}</p>
              <div class="project-meta">
                <div class="meta-dot"></div>
                <span class="meta-text">{{ project.memberCount }} member{{ project.memberCount !== 1 ? 's' : '' }}</span>
              </div>
            </div>
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

    .dashboard-main {
      max-width: 72rem;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-email {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-top: 0.25rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      gap: 1rem;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* Empty State - Project-Pal Style */
    .empty-box {
      border: 2px dashed var(--color-border);
      border-radius: 0.75rem;
      padding: 5rem 2rem;
      text-align: center;
    }

    .empty-icon-wrap {
      display: inline-flex;
      border-radius: 1rem;
      background: hsl(234 89% 63% / 0.05);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      color: var(--color-primary);
    }

    .empty-title {
      color: var(--color-text-secondary);
      margin-bottom: 0.25rem;
      font-size: 1.125rem;
      font-weight: 500;
    }

    .empty-desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-bottom: 1.5rem;
    }

    /* Projects Grid - Project-Pal Style */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.25rem;
    }

    @media (min-width: 768px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }

    .project-item {
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      box-shadow: var(--shadow-card);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .project-item:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-4px);
    }

    .project-color-bar {
      height: 0.5rem;
      width: 3rem;
      border-radius: 9999px;
      margin-bottom: 1rem;
    }

    .project-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 0.25rem;
      transition: color 0.2s ease;
    }

    .project-item:hover .project-name {
      color: var(--color-primary);
    }

    .project-desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-meta {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .meta-dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background: hsl(234 89% 63% / 0.6);
    }

    .meta-text {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class ProjectDashboardComponent implements OnInit {
  projects = signal<Project[]>([]);
  isLoading = signal(false);
  isCreateModalOpen = signal(false);

  private projectColors = [
    'hsl(234 89% 63%)',
    'hsl(280 68% 60%)',
    'hsl(152 68% 46%)',
    'hsl(36 95% 54%)',
    'hsl(340 75% 60%)',
    'hsl(190 90% 50%)',
  ];

  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    private router: Router
  ) {}

  get currentUser() { return this.authService.currentUser; }

  ngOnInit(): void { this.loadProjects(); }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectsService.getProjects().subscribe({
      next: (projects) => { this.projects.set(projects); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); }
    });
  }

  getProjectColor(index: number): string {
    return this.projectColors[index % this.projectColors.length];
  }

  openCreateModal(): void { this.isCreateModalOpen.set(true); }
  closeCreateModal(): void { this.isCreateModalOpen.set(false); }
  onProjectCreated(): void { this.closeCreateModal(); this.loadProjects(); }
  navigateToProject(projectId: string): void { this.router.navigate(['/project', projectId]); }
  logout(): void { this.authService.logout(); }
}
