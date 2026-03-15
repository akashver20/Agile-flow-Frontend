import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="empty-state">
      <div class="empty-illustration">
        <div class="illustration-circle">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="12" width="36" height="30" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M6 18H42" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="15" r="1" fill="currentColor"/>
            <circle cx="16" cy="15" r="1" fill="currentColor"/>
            <circle cx="20" cy="15" r="1" fill="currentColor"/>
            <rect x="14" y="24" width="20" height="2" rx="1" fill="currentColor" opacity="0.3"/>
            <rect x="14" y="30" width="14" height="2" rx="1" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      <div class="empty-action">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3xl) var(--spacing-xl);
      text-align: center;
      animation: fadeInUp 0.5s ease-out;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .empty-illustration {
      margin-bottom: var(--spacing-xl);
    }

    .illustration-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary-light), #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
    }

    .empty-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .empty-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-xl);
      max-width: 360px;
      line-height: 1.6;
    }

    .empty-action {
      animation: fadeIn 0.6s ease 0.2s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class EmptyStateComponent {
    @Input() title = 'No items found';
    @Input() description = 'Get started by creating your first item';
}
