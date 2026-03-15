import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onBackdropClick()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" (click)="close()" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: hsl(230 25% 14% / 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
      padding: 1.5rem;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-dialog {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      box-shadow: 0 25px 50px -12px hsl(230 25% 14% / 0.25);
      max-width: 28rem;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .modal-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 0.375rem;
      color: var(--color-text-secondary);
      transition: all 0.15s ease;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .modal-close:hover {
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .modal-body {
      padding: 1.5rem;
    }
  `]
})
export class ModalComponent {
    @Input() isOpen = false;
    @Input() title = '';
    @Output() closeModal = new EventEmitter<void>();

    close(): void { this.closeModal.emit(); }
    onBackdropClick(): void { this.close(); }

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        if (this.isOpen) this.close();
    }
}
