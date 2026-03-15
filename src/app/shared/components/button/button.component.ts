import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      [ngClass]="customClass">
      <ng-content></ng-content>
    </button>
  `,
    styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
      cursor: pointer;
      border: none;
      outline: none;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .btn-secondary {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-gray-200);
      border-color: var(--color-border-hover);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-text-secondary);
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .btn-danger {
      background-color: var(--color-danger);
      color: var(--color-text-inverse);
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .btn-sm {
      padding: var(--spacing-xs) var(--spacing-md);
      font-size: var(--font-size-xs);
    }

    .btn-lg {
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-base);
    }
  `]
})
export class ButtonComponent {
    @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled = false;
    @Input() customClass = '';

    get buttonClasses(): string {
        return `btn btn-${this.variant} btn-${this.size}`;
    }
}
