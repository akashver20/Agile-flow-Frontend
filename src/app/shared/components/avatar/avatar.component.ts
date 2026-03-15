import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="avatar" [class]="'avatar-' + size">
      <img *ngIf="src" [src]="src" [alt]="alt" class="avatar-img" />
      <span *ngIf="!src" class="avatar-initials">{{ initials }}</span>
    </div>
  `,
    styles: [`
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-primary), var(--color-info));
      color: var(--color-text-inverse);
      font-weight: var(--font-weight-medium);
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-sm {
      width: 24px;
      height: 24px;
      font-size: var(--font-size-xs);
    }

    .avatar-md {
      width: 32px;
      height: 32px;
      font-size: var(--font-size-sm);
    }

    .avatar-lg {
      width: 48px;
      height: 48px;
      font-size: var(--font-size-base);
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-initials {
      text-transform: uppercase;
    }
  `]
})
export class AvatarComponent {
    @Input() src = '';
    @Input() alt = '';
    @Input() name = '';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    get initials(): string {
        if (!this.name) return '?';
        const parts = this.name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return this.name.substring(0, 2).toUpperCase();
    }
}
