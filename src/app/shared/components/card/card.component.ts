import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card" [class.hoverable]="hoverable">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .card {
      background-color: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      transition: all var(--transition-base);
    }

    .card.hoverable {
      cursor: pointer;
    }

    .card.hoverable:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
      border-color: var(--color-border-hover);
    }
  `]
})
export class CardComponent {
    @Input() hoverable = false;
}
