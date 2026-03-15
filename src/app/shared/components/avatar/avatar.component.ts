import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #14b8a6, #0d9488)',
  'linear-gradient(135deg, #f97316, #ea580c)',
];

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="avatar" [class]="'avatar-' + size" [style.background]="avatarBg">
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
      color: white;
      font-weight: 600;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
      letter-spacing: 0.03em;
    }

    .avatar-sm {
      width: 24px;
      height: 24px;
      font-size: 0.65rem;
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
export class AvatarComponent implements OnChanges {
    @Input() src = '';
    @Input() alt = '';
    @Input() name = '';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    avatarBg = AVATAR_COLORS[0];

    ngOnChanges(): void {
        this.avatarBg = this.getColorFromName();
    }

    get initials(): string {
        if (!this.name) return '?';
        const parts = this.name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return this.name.substring(0, 2).toUpperCase();
    }

    private getColorFromName(): string {
        if (!this.name) return AVATAR_COLORS[0];
        let hash = 0;
        for (let i = 0; i < this.name.length; i++) {
            hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
    }
}
