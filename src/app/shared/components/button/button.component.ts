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
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      outline: none;
      white-space: nowrap;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      border: 0;
      box-shadow: var(--shadow-glow);
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: scale(1.05);
    }

    .btn-secondary {
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: var(--shadow-md);
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
      background: linear-gradient(135deg, hsl(4 76% 56%), hsl(4 76% 46%));
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      opacity: 0.9;
      transform: scale(1.05);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    .btn-lg {
      padding: 0.625rem 2rem;
      font-size: 1rem;
      font-weight: 600;
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
