import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { Ticket, TicketPriority } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  template: `
    <div class="task-card gradient-card">
      <div class="task-body">
        <p class="task-title">{{ ticket.title }}</p>
        <p *ngIf="ticket.description" class="task-desc">{{ ticket.description }}</p>
        <div class="task-meta">
          <span class="priority-pill" [class]="'priority-' + ticket.priority.toLowerCase()">
            {{ ticket.priority.toLowerCase() }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      padding: 0.875rem;
      cursor: grab;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-card);
    }

    .task-card:active {
      cursor: grabbing;
    }

    .task-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }

    .task-body {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .task-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-desc {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .priority-pill {
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .priority-low {
      background: var(--color-bg-tertiary);
      color: var(--color-text-secondary);
    }

    .priority-medium {
      background: hsl(36 95% 54% / 0.15);
      color: hsl(36 95% 44%);
    }

    .priority-high {
      background: hsl(4 76% 56% / 0.15);
      color: hsl(4 76% 46%);
    }

    .priority-urgent {
      background: hsl(4 76% 56% / 0.2);
      color: hsl(4 76% 40%);
    }
  `]
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Input() assignee?: User;
}
