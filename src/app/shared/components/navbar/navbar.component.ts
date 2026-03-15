import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../features/auth/auth.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <header class="navbar glass">
      <div class="nav-inner">
        <div class="nav-left">
          <button *ngIf="showBack" class="btn-back" (click)="onBack.emit()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
          
          <ng-container *ngIf="project; else defaultBrand">
            <div class="project-badge">
              <div class="project-dot"></div>
              <h1 class="project-name font-display">{{ project.name }}</h1>
            </div>
          </ng-container>
          <ng-template #defaultBrand>
            <div class="brand">
              <div class="brand-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <span class="brand-name font-display">Agile Flow</span>
            </div>
          </ng-template>
        </div>

        <div class="nav-right">
          <ng-content select="[nav-actions]"></ng-content>
          
          <button class="btn-logout" (click)="logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid hsl(228 16% 88% / 0.5);
      padding: 0 1.5rem;
      height: 57px;
      display: flex;
      align-items: center;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.5rem;
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-back:hover {
      background: hsl(234 89% 63% / 0.05);
      color: var(--color-text-primary);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .brand-icon {
      background: var(--gradient-primary);
      border-radius: 0.5rem;
      padding: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .project-badge {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .project-dot {
      width: 0.875rem;
      height: 0.875rem;
      border-radius: 50%;
      background: var(--color-primary);
      box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-border);
    }

    .project-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 0.375rem;
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      color: var(--color-danger);
      background: hsl(4 76% 56% / 0.05);
    }
  `]
})
export class NavbarComponent {
  @Input() project?: Project;
  @Input() showBack = false;
  @Output() onBack = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
