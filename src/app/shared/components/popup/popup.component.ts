import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Toasts Container -->
    <div class="toast-container" *ngIf="popupService.toasts().length > 0">
      <div *ngFor="let toast of popupService.toasts()" 
           class="toast" 
           [ngClass]="'toast-' + toast.type"
           (click)="popupService.removeToast(toast.id)">
        
        <span class="toast-icon">
          <ng-container *ngIf="toast.type === 'success'">✓</ng-container>
          <ng-container *ngIf="toast.type === 'error'">✕</ng-container>
          <ng-container *ngIf="toast.type === 'warning'">⚠</ng-container>
          <ng-container *ngIf="toast.type === 'info'">i</ng-container>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>

    <!-- Confirm Dialog Overlay -->
    <div class="dialog-overlay" *ngIf="popupService.confirmDialog() as dialog">
      <div class="dialog-card fade-in-up">
        <h3 class="dialog-title">Are you sure?</h3>
        <p class="dialog-message">{{ dialog.message }}</p>
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="handleCancel(dialog)">Cancel</button>
          <button class="btn-danger" (click)="handleConfirm(dialog)">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Input Dialog Overlay -->
    <div class="dialog-overlay" *ngIf="popupService.inputDialog() as inputDialog">
      <div class="dialog-card fade-in-up">
        <h3 class="dialog-title">{{ inputDialog.title }}</h3>
        <p class="dialog-message">{{ inputDialog.message }}</p>
        <input
          class="dialog-input"
          [placeholder]="inputDialog.placeholder"
          [(ngModel)]="inputValue"
          (keydown.enter)="handleInputSubmit(inputDialog)"
          autofocus
        />
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="handleInputCancel(inputDialog)">Cancel</button>
          <button class="btn-primary" (click)="handleInputSubmit(inputDialog)" [disabled]="!inputValue.trim()">
            Submit
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Toasts */
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      background: hsl(0 0% 100% / 0.9);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-lg);
      cursor: pointer;
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;
      min-width: 300px;
      border-left: 4px solid transparent;
    }

    .toast:hover {
      transform: translateY(-2px);
    }

    .toast-success { border-left-color: hsl(152 68% 46%); }
    .toast-error { border-left-color: hsl(4 76% 56%); }
    .toast-warning { border-left-color: hsl(36 95% 54%); }
    .toast-info { border-left-color: hsl(234 89% 63%); }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-weight: bold;
      color: white;
      font-size: 14px;
    }

    .toast-success .toast-icon { background: hsl(152 68% 46%); }
    .toast-error .toast-icon { background: hsl(4 76% 56%); }
    .toast-warning .toast-icon { background: hsl(36 95% 54%); }
    .toast-info .toast-icon { background: hsl(234 89% 63%); }

    .toast-message {
      color: var(--color-text-primary);
      font-weight: 500;
      font-size: 0.875rem;
    }

    /* Dialog Overlay */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: hsl(230 25% 14% / 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.15s ease;
    }

    .dialog-card {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.5rem 2rem;
      width: 90%;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px hsl(230 25% 14% / 0.25);
    }

    .dialog-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .dialog-message {
      margin: 0 0 1.25rem 0;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .dialog-input {
      width: 100%;
      padding: 0.625rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      margin-bottom: 1.25rem;
      transition: all 0.2s ease;
    }

    .dialog-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px hsl(234 89% 63% / 0.12);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn-cancel, .btn-danger, .btn-primary {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-cancel {
      background: transparent;
      color: var(--color-text-secondary);
    }

    .btn-cancel:hover {
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .btn-danger {
      background: linear-gradient(135deg, hsl(4 76% 56%), hsl(4 76% 46%));
      color: white;
    }

    .btn-danger:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Animations */
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .fade-in-up {
      animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInUp {
      from { transform: translateY(20px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `]
})
export class PopupComponent {
  inputValue = '';

  constructor(public popupService: PopupService) {}

  handleConfirm(dialog: any) {
    dialog.onConfirm();
    this.popupService.closeConfirm();
  }

  handleCancel(dialog: any) {
    if (dialog.onCancel) dialog.onCancel();
    this.popupService.closeConfirm();
  }

  handleInputSubmit(dialog: any) {
    if (this.inputValue.trim()) {
      dialog.onSubmit(this.inputValue.trim());
      this.inputValue = '';
      this.popupService.closeInput();
    }
  }

  handleInputCancel(dialog: any) {
    if (dialog.onCancel) dialog.onCancel();
    this.inputValue = '';
    this.popupService.closeInput();
  }
}
