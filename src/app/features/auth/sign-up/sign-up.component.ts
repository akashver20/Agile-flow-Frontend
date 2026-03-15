import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
    template: `
    <div class="auth-page">
      <div class="auth-blob blob-1"></div>
      <div class="auth-blob blob-2"></div>

      <div class="auth-wrapper animate-fade-in-up" style="opacity: 0">
        <a routerLink="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to home
        </a>

        <a routerLink="/" class="auth-brand">
          <div class="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <span class="brand-text font-display">ProjectFlow</span>
        </a>

        <div class="auth-card gradient-card">
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Get started with Agile Flow today</p>

          <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="fullName" class="form-label">Full Name</label>
              <input id="fullName" type="text" formControlName="fullName" class="form-input"
                [class.error]="isFieldInvalid('fullName')" placeholder="John Doe"/>
              <span *ngIf="isFieldInvalid('fullName')" class="error-message">{{ getErrorMessage('fullName') }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" formControlName="email" class="form-input"
                [class.error]="isFieldInvalid('email')" placeholder="you@example.com"/>
              <span *ngIf="isFieldInvalid('email')" class="error-message">{{ getErrorMessage('email') }}</span>
            </div>

            <div class="form-group">
              <label for="role" class="form-label">Role</label>
              <select id="role" formControlName="role" class="form-input" [class.error]="isFieldInvalid('role')">
                <option value="">Select a role</option>
                <option [value]="UserRole.ADMIN">Admin</option>
                <option [value]="UserRole.MEMBER">Member</option>
              </select>
              <span *ngIf="isFieldInvalid('role')" class="error-message">{{ getErrorMessage('role') }}</span>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input id="password" type="password" formControlName="password" class="form-input"
                [class.error]="isFieldInvalid('password')" placeholder="••••••••"/>
              <span *ngIf="isFieldInvalid('password')" class="error-message">{{ getErrorMessage('password') }}</span>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword" class="form-input"
                [class.error]="isFieldInvalid('confirmPassword')" placeholder="••••••••"/>
              <span *ngIf="isFieldInvalid('confirmPassword')" class="error-message">{{ getErrorMessage('confirmPassword') }}</span>
            </div>

            <app-button type="submit" variant="primary" [disabled]="isLoading() || signUpForm.invalid" customClass="w-full">
              {{ isLoading() ? 'Creating account...' : 'Create Account' }}
            </app-button>

            <div *ngIf="errorMessage()" class="error-banner">{{ errorMessage() }}</div>
          </form>

          <p class="auth-footer-text">
            Already have an account?
            <a routerLink="/sign-in" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .auth-blob { position: absolute; border-radius: 50%; filter: blur(48px); }
    .blob-1 { top: 25%; left: -5rem; width: 20rem; height: 20rem; background: hsl(234 89% 63% / 0.05); }
    .blob-2 { bottom: 25%; right: -5rem; width: 20rem; height: 20rem; background: hsl(280 68% 60% / 0.05); }

    .auth-wrapper { width: 100%; max-width: 24rem; position: relative; z-index: 10; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-decoration: none;
      margin-bottom: 1.5rem;
      transition: all 0.2s ease;
    }

    .back-link:hover {
      color: var(--color-primary);
      transform: translateX(-2px);
    }

    .auth-brand {
      display: flex; align-items: center; justify-content: center;
      gap: 0.625rem; margin-bottom: 2.5rem; text-decoration: none;
    }

    .brand-icon {
      background: var(--gradient-primary); border-radius: 0.5rem;
      padding: 0.375rem; display: flex; align-items: center; justify-content: center;
    }

    .brand-text { font-size: 1.125rem; font-weight: 700; color: var(--color-text-primary); }

    .auth-card {
      border: 1px solid var(--color-border); border-radius: 0.75rem;
      padding: 1.75rem; box-shadow: var(--shadow-card);
    }

    .auth-title { font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.25rem; }
    .auth-subtitle { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1.5rem; }

    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); }

    .form-input {
      width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem;
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      background-color: var(--color-bg-primary); color: var(--color-text-primary);
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none; border-color: var(--color-primary);
      box-shadow: 0 0 0 3px hsl(234 89% 63% / 0.12);
    }

    .form-input.error { border-color: var(--color-danger); }
    .error-message { font-size: 0.75rem; color: var(--color-danger); }

    .error-banner {
      padding: 0.75rem; background-color: hsl(4 76% 56% / 0.1); color: var(--color-danger);
      border-radius: var(--radius-md); font-size: 0.875rem; text-align: center;
    }

    .auth-footer-text { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; margin-top: 1.25rem; }
    .auth-link { color: var(--color-primary); font-weight: 500; }
    .auth-link:hover { text-decoration: underline; }
    select.form-input { cursor: pointer; }
    :host ::ng-deep .w-full { width: 100%; }
  `]
})
export class SignUpComponent {
    signUpForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal('');
    UserRole = UserRole;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.signUpForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            role: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (!password || !confirmPassword) return null;
        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.signUpForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getErrorMessage(fieldName: string): string {
        const field = this.signUpForm.get(fieldName);
        if (field?.hasError('required')) return 'This field is required';
        if (field?.hasError('email')) return 'Please enter a valid email';
        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `Must be at least ${minLength} characters`;
        }
        if (fieldName === 'confirmPassword' && this.signUpForm.hasError('passwordMismatch')) return 'Passwords do not match';
        return '';
    }

    onSubmit(): void {
        if (this.signUpForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');
            const { confirmPassword, ...signUpData } = this.signUpForm.value;
            this.authService.signUp(signUpData).subscribe({
                next: () => { this.isLoading.set(false); this.router.navigate(['/dashboard']); },
                error: (error) => { this.isLoading.set(false); this.errorMessage.set(error.message || 'Failed to create account'); }
            });
        } else {
            Object.keys(this.signUpForm.controls).forEach(key => { this.signUpForm.get(key)?.markAsTouched(); });
        }
    }
}
