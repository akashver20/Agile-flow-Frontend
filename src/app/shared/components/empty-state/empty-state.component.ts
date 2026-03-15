import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2"/>
          <path d="M8 24H56" stroke="currentColor" stroke-width="2"/>
          <circle cx="16" cy="20" r="1.5" fill="currentColor"/>
          <circle cx="22" cy="20" r="1.5" fill="currentColor"/>
          <circle cx="28" cy="20" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3xl);
      text-align: center;
    }

    .empty-icon {
      color: var(--color-gray-300);
      margin-bottom: var(--spacing-lg);
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
      margin-bottom: var(--spacing-lg);
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
    @Input() title = 'No items found';
    @Input() description = 'Get started by creating your first item';
}
