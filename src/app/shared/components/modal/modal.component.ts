import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onBackdropClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" (click)="close()" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
      padding: var(--spacing-lg);
      animation: fadeIn var(--transition-base);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp var(--transition-base);
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      transition: all var(--transition-base);
    }

    .modal-close:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .modal-body {
      padding: var(--spacing-lg);
    }
  `]
})
export class ModalComponent {
    @Input() isOpen = false;
    @Input() title = '';
    @Output() closeModal = new EventEmitter<void>();

    close(): void {
        this.closeModal.emit();
    }

    onBackdropClick(): void {
        this.close();
    }

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        if (this.isOpen) {
            this.close();
        }
    }
}
