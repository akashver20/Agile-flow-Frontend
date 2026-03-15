import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="badge" [class]="'badge-' + variant">
      <ng-content></ng-content>
    </span>
  `,
    styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-full);
      white-space: nowrap;
    }

    .badge-primary {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    }

    .badge-success {
      background-color: #d1fae5;
      color: var(--color-success);
    }

    .badge-warning {
      background-color: #fef3c7;
      color: var(--color-warning);
    }

    .badge-danger {
      background-color: #fee2e2;
      color: var(--color-danger);
    }

    .badge-gray {
      background-color: var(--color-gray-100);
      color: var(--color-gray-600);
    }
  `]
})
export class BadgeComponent {
    @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'gray' = 'primary';
}
