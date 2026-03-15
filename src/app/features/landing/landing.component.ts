import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="landing">
      <!-- Nav -->
      <nav class="nav glass">
        <div class="nav-inner">
          <div class="brand">
            <div class="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <span class="brand-text">Agile Flow</span>
          </div>
          <div class="nav-actions">
            <app-button variant="ghost" size="sm" (click)="navigateToSignIn()">Sign In</app-button>
            <app-button variant="primary" size="sm" (click)="navigateToSignUp()">Get Started</app-button>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg gradient-hero"></div>
        <div class="hero-blob blob-1 animate-float"></div>
        <div class="hero-blob blob-2 animate-float" style="animation-delay: 1.5s"></div>

        <div class="hero-inner">
          <div class="hero-badge animate-fade-in" style="animation-delay: 0.1s; opacity: 0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Project management, reimagined
          </div>

          <h1 class="hero-title animate-fade-in-up" style="animation-delay: 0.2s; opacity: 0">
            Ship projects<br/>
            <span class="text-gradient">10x faster</span>
          </h1>

          <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.4s; opacity: 0">
            The modern project management tool built for teams who move fast.
            Kanban boards, task tracking, and seamless collaboration.
          </p>

          <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.6s; opacity: 0">
            <app-button variant="primary" size="lg" (click)="navigateToSignUp()">
              Start Building
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </app-button>
            <app-button variant="secondary" size="lg" (click)="navigateToSignIn()">Sign In</app-button>
          </div>

          <!-- Stats -->
          <div class="hero-stats animate-fade-in-up" style="animation-delay: 0.8s; opacity: 0">
            <div class="stat">
              <p class="stat-value text-gradient font-display">10x</p>
              <p class="stat-label">Faster delivery</p>
            </div>
            <div class="stat">
              <p class="stat-value text-gradient font-display">99.9%</p>
              <p class="stat-label">Uptime</p>
            </div>
            <div class="stat">
              <p class="stat-value text-gradient font-display">50k+</p>
              <p class="stat-label">Tasks managed</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features-section">
        <div class="features-inner">
          <div class="features-header">
            <h2 class="features-title">Everything you need to <span class="text-gradient">deliver</span></h2>
            <p class="features-desc">Powerful features designed to help your team stay organized and ship faster.</p>
          </div>
          <div class="features-grid">
            <div *ngFor="let feature of features; let i = index"
                 class="feature-card gradient-card animate-fade-in-up"
                 [style.animation-delay]="(0.2 * i) + 's'"
                 style="opacity: 0">
              <div class="feature-icon" [style.background]="feature.gradient">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" [innerHTML]="feature.iconPath"></svg>
              </div>
              <h3 class="feature-name font-display">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-card gradient-primary">
          <div class="cta-shimmer animate-shimmer"></div>
          <div class="cta-inner">
            <h2 class="cta-title">Ready to supercharge your workflow?</h2>
            <p class="cta-desc">Join thousands of teams already using Agile Flow to ship faster.</p>
            <app-button variant="secondary" size="lg" (click)="navigateToSignUp()">
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </app-button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <p>© 2026 Agile Flow. Built for teams that ship.</p>
      </footer>
    </div>
  `,
    styles: [`
    .landing {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
      overflow: hidden;
    }

    /* Nav */
    .nav {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid hsl(228 16% 88% / 0.5);
      padding: 1rem 1.5rem;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 80rem;
      margin: 0 auto;
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

    .brand-text {
      font-family: var(--font-family-display);
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Hero */
    .hero {
      position: relative;
      padding: 7rem 1.5rem 5rem;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
    }

    .hero-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(48px);
    }

    .blob-1 {
      top: 5rem;
      left: 25%;
      width: 18rem;
      height: 18rem;
      background: hsl(234 89% 63% / 0.05);
    }

    .blob-2 {
      bottom: 5rem;
      right: 25%;
      width: 24rem;
      height: 24rem;
      background: hsl(280 68% 60% / 0.05);
    }

    .hero-inner {
      max-width: 56rem;
      margin: 0 auto;
      text-align: center;
      position: relative;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 9999px;
      border: 1px solid hsl(234 89% 63% / 0.2);
      background: hsl(234 89% 63% / 0.05);
      padding: 0.375rem 1rem;
      font-size: 0.875rem;
      color: var(--color-primary);
      font-weight: 500;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    @media (min-width: 768px) {
      .hero-title {
        font-size: 4.5rem;
      }
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      max-width: 42rem;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
    }

    @media (min-width: 768px) {
      .hero-subtitle {
        font-size: 1.25rem;
      }
    }

    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      margin-top: 4rem;
    }

    @media (min-width: 768px) {
      .hero-stats { gap: 4rem; }
    }

    .stat { text-align: center; }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
    }

    @media (min-width: 768px) {
      .stat-value { font-size: 1.875rem; }
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-top: 0.25rem;
    }

    /* Features */
    .features-section {
      padding: 6rem 1.5rem;
      position: relative;
    }

    .features-inner {
      max-width: 72rem;
      margin: 0 auto;
    }

    .features-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .features-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--color-text-primary);
    }

    @media (min-width: 768px) {
      .features-title { font-size: 2.25rem; }
    }

    .features-desc {
      color: var(--color-text-secondary);
      max-width: 32rem;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.25rem;
    }

    @media (min-width: 768px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 1024px) {
      .features-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .feature-card {
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: var(--shadow-card);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-4px);
    }

    .feature-icon {
      display: inline-flex;
      border-radius: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 1rem;
      color: var(--color-primary);
      transition: transform 0.3s ease;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1);
    }

    .feature-name {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
    }

    .feature-desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    /* CTA */
    .cta-section {
      padding: 5rem 1.5rem;
    }

    .cta-card {
      max-width: 48rem;
      margin: 0 auto;
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      box-shadow: var(--shadow-glow);
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .cta-card { padding: 4rem; }
    }

    .cta-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, transparent, hsl(0 0% 100% / 0.05), transparent);
      background-size: 200% 100%;
    }

    .cta-inner { position: relative; }

    .cta-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    @media (min-width: 768px) {
      .cta-title { font-size: 1.875rem; }
    }

    .cta-desc {
      color: hsl(0 0% 100% / 0.8);
      margin-bottom: 2rem;
      max-width: 32rem;
      margin-left: auto;
      margin-right: auto;
    }

    /* Footer */
    .landing-footer {
      border-top: 1px solid var(--color-border);
      padding: 2rem 1.5rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
  `]
})
export class LandingComponent {
    features = [
      {
        title: 'Kanban Boards',
        description: 'Drag and drop tasks across columns to track progress visually.',
        gradient: 'linear-gradient(to bottom right, hsl(234 89% 63% / 0.1), hsl(280 68% 60% / 0.1))',
        iconPath: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
      },
      {
        title: 'Project Dashboard',
        description: "Get a bird's eye view of all your projects in one place.",
        gradient: 'linear-gradient(to bottom right, hsl(280 68% 60% / 0.1), hsl(234 89% 63% / 0.1))',
        iconPath: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>'
      },
      {
        title: 'Team Collaboration',
        description: 'Work together seamlessly with your team members.',
        gradient: 'linear-gradient(to bottom right, hsl(152 68% 46% / 0.1), hsl(234 89% 63% / 0.1))',
        iconPath: '<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>'
      },
      {
        title: 'Lightning Fast',
        description: 'Built for speed. No lag, no waiting, just productivity.',
        gradient: 'linear-gradient(to bottom right, hsl(36 95% 54% / 0.1), hsl(280 68% 60% / 0.1))',
        iconPath: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
      }
    ];

    constructor(private router: Router) { }

    navigateToSignIn() {
        this.router.navigate(['/sign-in']);
    }

    navigateToSignUp() {
        this.router.navigate(['/sign-up']);
    }
}
