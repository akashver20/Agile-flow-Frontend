import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
    template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M8 12H24M8 16H24M8 20H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#6366f1"/>
                  <stop offset="1" stop-color="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form [formGroup]="signInForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.error]="isFieldInvalid('email')"
              placeholder="you@example.com"
            />
            <span *ngIf="isFieldInvalid('email')" class="error-message">
              {{ getErrorMessage('email') }}
            </span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="form-input"
              [class.error]="isFieldInvalid('password')"
              placeholder="••••••••"
            />
            <span *ngIf="isFieldInvalid('password')" class="error-message">
              {{ getErrorMessage('password') }}
            </span>
          </div>

          <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>

          <app-button
            type="submit"
            variant="primary"
            [disabled]="isLoading() || signInForm.invalid"
            customClass="w-full"
          >
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </app-button>

          <div *ngIf="errorMessage()" class="error-banner">
            {{ errorMessage() }}
          </div>
        </form>

        <div class="auth-footer">
          <p class="footer-text">
            Don't have an account?
            <a routerLink="/sign-up" class="footer-link">Sign up</a>
          </p>
        </div>

        <div class="demo-credentials">
          <p class="demo-title">Demo Credentials:</p>
          <p class="demo-text">Email: admin@example.com</p>
          <p class="demo-text">Password: password</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-lg);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-container {
      width: 100%;
      max-width: 420px;
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-lg);
    }

    .auth-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .auth-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }

    .form-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      transition: all var(--transition-base);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .form-input.error {
      border-color: var(--color-danger);
    }

    .error-message {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }

    .forgot-link {
      font-size: var(--font-size-sm);
      color: var(--color-primary);
      text-align: right;
      margin-top: calc(var(--spacing-sm) * -1);
      transition: color var(--transition-base);
    }

    .forgot-link:hover {
      color: var(--color-primary-hover);
    }

    .error-banner {
      padding: var(--spacing-md);
      background-color: #fee2e2;
      color: var(--color-danger);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      text-align: center;
    }

    .auth-footer {
      margin-top: var(--spacing-xl);
      text-align: center;
    }

    .footer-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .footer-link {
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
      transition: color var(--transition-base);
    }

    .footer-link:hover {
      color: var(--color-primary-hover);
    }

    .demo-credentials {
      margin-top: var(--spacing-lg);
      padding: var(--spacing-md);
      background-color: var(--color-primary-light);
      border-radius: var(--radius-md);
      text-align: center;
    }

    .demo-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
    }

    .demo-text {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }

    :host ::ng-deep .w-full {
      width: 100%;
    }
  `]
})
export class SignInComponent {
    signInForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal('');

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.signInForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.signInForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getErrorMessage(fieldName: string): string {
        const field = this.signInForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'This field is required';
        }
        if (field?.hasError('email')) {
            return 'Please enter a valid email';
        }
        if (field?.hasError('minlength')) {
            return 'Password must be at least 6 characters';
        }
        return '';
    }

    onSubmit(): void {
        if (this.signInForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');

            this.authService.login(this.signInForm.value).subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.isLoading.set(false);
                    this.errorMessage.set(error.message || 'Invalid email or password');
                }
            });
        } else {
            Object.keys(this.signInForm.controls).forEach(key => {
                this.signInForm.get(key)?.markAsTouched();
            });
        }
    }
}
