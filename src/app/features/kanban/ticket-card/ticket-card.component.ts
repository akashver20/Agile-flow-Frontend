import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { Ticket, TicketPriority } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, AvatarComponent, BadgeComponent],
  template: `
    <div class="ticket-card" [class]="'priority-' + ticket.priority.toLowerCase()">
      <div class="ticket-header">
        <h4 class="ticket-title">{{ ticket.title }}</h4>
        <div class="priority-indicator" [class]="'priority-' + ticket.priority.toLowerCase()"></div>
      </div>
      


      <div class="ticket-footer">
        <div class="footer-left">
          <app-avatar
            *ngIf="assignee"
            [name]="assignee.fullName"
            [src]="assignee.avatar || ''"
            size="sm"
          />
          <span *ngIf="!assignee" class="unassigned">Unassigned</span>
        </div>
        <app-badge *ngIf="ticket.storyPoints" variant="gray">
          {{ ticket.storyPoints }} pts
        </app-badge>
      </div>
    </div>
  `,
  styles: [`
    .ticket-card {
      background-color: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border-left: 3px solid transparent;
    }

    .ticket-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .ticket-card.priority-low {
      border-left-color: var(--color-priority-low);
    }

    .ticket-card.priority-medium {
      border-left-color: var(--color-priority-medium);
    }

    .ticket-card.priority-high {
      border-left-color: var(--color-priority-high);
    }

    .ticket-card.priority-urgent {
      border-left-color: var(--color-priority-urgent);
    }

    .ticket-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
    }

    .ticket-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      line-height: 1.4;
      flex: 1;
    }

    .priority-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .priority-indicator.priority-low {
      background-color: var(--color-priority-low);
    }

    .priority-indicator.priority-medium {
      background-color: var(--color-priority-medium);
    }

    .priority-indicator.priority-high {
      background-color: var(--color-priority-high);
    }

    .priority-indicator.priority-urgent {
      background-color: var(--color-priority-urgent);
    }

    .ticket-description {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      line-height: 1.4;
      margin-bottom: var(--spacing-md);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ticket-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-sm);
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .unassigned {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      font-style: italic;
    }
  `]
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Input() assignee?: User;
}
