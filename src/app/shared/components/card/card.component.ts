import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card gradient-card" [class.hoverable]="hoverable">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .card {
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: var(--spacing-lg);
      transition: all 0.3s ease;
      box-shadow: var(--shadow-card);
    }

    .card.hoverable {
      cursor: pointer;
    }

    .card.hoverable:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-4px);
    }
  `]
})
export class CardComponent {
    @Input() hoverable = false;
}
