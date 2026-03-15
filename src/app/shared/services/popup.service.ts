import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface ConfirmDialog {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface InputDialog {
  title: string;
  message: string;
  placeholder: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private nextId = 0;
  
  // State for toasts (multiple can be shown at once)
  toasts = signal<ToastMessage[]>([]);
  
  // State for confirm dialog (only one at a time)
  confirmDialog = signal<ConfirmDialog | null>(null);

  // State for input dialog
  inputDialog = signal<InputDialog | null>(null);

  toast(message: string, type: ToastMessage['type'] = 'info') {
    const id = this.nextId++;
    this.toasts.update(toasts => [...toasts, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  success(message: string) {
    this.toast(message, 'success');
  }

  warning(message: string) {
    this.toast(message, 'warning');
  }

  error(message: string) {
    this.toast(message, 'error');
  }

  removeToast(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  confirm(message: string, onConfirm: () => void, onCancel?: () => void) {
    this.confirmDialog.set({ message, onConfirm, onCancel });
  }

  closeConfirm() {
    this.confirmDialog.set(null);
  }

  prompt(title: string, message: string, placeholder: string, onSubmit: (value: string) => void, onCancel?: () => void) {
    this.inputDialog.set({ title, message, placeholder, onSubmit, onCancel });
  }

  closeInput() {
    this.inputDialog.set(null);
  }
}
