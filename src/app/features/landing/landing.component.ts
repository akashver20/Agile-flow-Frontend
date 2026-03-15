import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [ButtonComponent],
    template: `
    <div class="landing">
      <nav class="navbar">
        <div class="container">
          <div class="nav-content">
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
            <div class="nav-actions">
              <app-button variant="ghost" (click)="navigateToSignIn()">Sign In</app-button>
              <app-button variant="primary" (click)="navigateToSignUp()">Get Started</app-button>
            </div>
          </div>
        </div>
      </nav>

      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              Manage Projects with
              <span class="gradient-text">Effortless Precision</span>
            </h1>
            <p class="hero-description">
              A modern Kanban board for teams that value simplicity and productivity. 
              Organize tasks, collaborate seamlessly, and ship faster.
            </p>
            <div class="hero-actions">
              <app-button variant="primary" size="lg" (click)="navigateToSignUp()">
                Start Free Trial
              </app-button>
              <app-button variant="secondary" size="lg" (click)="navigateToSignIn()">
                Sign In
              </app-button>
            </div>
          </div>

          <div class="hero-visual">
            <div class="board-preview">
              <div class="board-column">
                <div class="column-header">To Do</div>
                <div class="task-card"></div>
                <div class="task-card"></div>
              </div>
              <div class="board-column">
                <div class="column-header">In Progress</div>
                <div class="task-card"></div>
              </div>
              <div class="board-column">
                <div class="column-header">Done</div>
                <div class="task-card"></div>
                <div class="task-card"></div>
                <div class="task-card"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .landing {
      min-height: 100vh;
      background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
    }

    .navbar {
      padding: var(--spacing-lg) 0;
      border-bottom: 1px solid var(--color-border);
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .nav-actions {
      display: flex;
      gap: var(--spacing-md);
    }

    .hero {
      padding: var(--spacing-3xl) 0;
    }

    .hero-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto var(--spacing-3xl);
    }

    .hero-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-lg);
      line-height: 1.2;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-info));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-xl);
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
    }

    .hero-visual {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--spacing-xl);
    }

    .board-preview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      background-color: var(--color-bg-secondary);
      padding: var(--spacing-xl);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
    }

    .board-column {
      background-color: var(--color-bg-tertiary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      min-height: 200px;
    }

    .column-header {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .task-card {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-md);
      height: 60px;
      margin-bottom: var(--spacing-sm);
      box-shadow: var(--shadow-sm);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: var(--font-size-3xl);
      }

      .hero-actions {
        flex-direction: column;
      }

      .board-preview {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent {
    constructor(private router: Router) { }

    navigateToSignIn(): void {
        this.router.navigate(['/sign-in']);
    }

    navigateToSignUp(): void {
        this.router.navigate(['/sign-up']);
    }
}
