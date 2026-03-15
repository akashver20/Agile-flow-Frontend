import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
    <div class="input-wrapper">
      <label *ngIf="label" [for]="id" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="input"
        [class.error]="error"
      />
      <span *ngIf="error" class="error-message">{{ error }}</span>
    </div>
  `,
    styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      width: 100%;
    }

    .input-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }

    .required {
      color: var(--color-danger);
    }

    .input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      transition: all var(--transition-base);
    }

    .input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .input:disabled {
      background-color: var(--color-bg-tertiary);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .input.error {
      border-color: var(--color-danger);
    }

    .input.error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-message {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
    @Input() id = '';
    @Input() label = '';
    @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
    @Input() placeholder = '';
    @Input() required = false;
    @Input() error = '';
    @Input() disabled = false;

    value = '';
    onChange: any = () => { };
    onTouched: any = () => { };

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
        this.onChange(this.value);
    }

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
