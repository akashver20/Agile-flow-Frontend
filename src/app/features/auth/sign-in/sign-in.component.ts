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
      <!-- Background blobs -->
      <div class="auth-blob blob-1 animate-float"></div>
      <div class="auth-blob blob-2 animate-float" style="animation-delay: 1.5s"></div>
      <div class="auth-blob blob-3 animate-float" style="animation-delay: 3s"></div>

      <!-- Floating task cards illustration -->
      <div class="floating-illustration">
        <div class="float-card card-1 animate-float" style="animation-delay: 0s">
          <div class="float-card-dot dot-blue"></div>
          <div class="float-card-line line-long"></div>
          <div class="float-card-line line-short"></div>
        </div>
        <div class="float-card card-2 animate-float" style="animation-delay: 0.8s">
          <div class="float-card-dot dot-green"></div>
          <div class="float-card-line line-long"></div>
          <div class="float-card-line line-medium"></div>
        </div>
        <div class="float-card card-3 animate-float" style="animation-delay: 1.6s">
          <div class="float-card-dot dot-purple"></div>
          <div class="float-card-line line-medium"></div>
          <div class="float-card-line line-short"></div>
        </div>
        <div class="float-card card-4 animate-float" style="animation-delay: 2.2s">
          <div class="float-card-dot dot-orange"></div>
          <div class="float-card-line line-long"></div>
          <div class="float-card-line line-long"></div>
        </div>
      </div>

      <div class="auth-wrapper animate-fade-in-up" style="opacity: 0; animation-delay: 0.1s">
        <!-- Back to Landing -->
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
          <span class="brand-text font-display">Agile Flow</span>
        </a>

        <div class="auth-card gradient-card">
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">Sign in to your account</p>

          <form [formGroup]="signInForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" formControlName="email" class="form-input"
                [class.error]="isFieldInvalid('email')" placeholder="you@example.com" />
              <span *ngIf="isFieldInvalid('email')" class="error-message">{{ getErrorMessage('email') }}</span>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input id="password" type="password" formControlName="password" class="form-input"
                [class.error]="isFieldInvalid('password')" placeholder="••••••••" />
              <span *ngIf="isFieldInvalid('password')" class="error-message">{{ getErrorMessage('password') }}</span>
            </div>

            <app-button type="submit" variant="primary" [disabled]="isLoading() || signInForm.invalid" customClass="w-full">
              {{ isLoading() ? 'Signing in...' : 'Sign In' }}
            </app-button>

            <div *ngIf="errorMessage()" class="error-banner">{{ errorMessage() }}</div>
          </form>

          <p class="auth-footer-text">
            Don't have an account?
            <a routerLink="/sign-up" class="auth-link">Sign up</a>
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

    /* Floating blobs */
    .auth-blob { position: absolute; border-radius: 50%; filter: blur(48px); }
    .blob-1 { top: 15%; left: -3rem; width: 20rem; height: 20rem; background: hsl(234 89% 63% / 0.06); }
    .blob-2 { bottom: 10%; right: -5rem; width: 24rem; height: 24rem; background: hsl(280 68% 60% / 0.06); }
    .blob-3 { top: 50%; left: 60%; width: 16rem; height: 16rem; background: hsl(152 68% 46% / 0.04); }

    /* Floating task card illustrations */
    .floating-illustration {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .float-card {
      position: absolute;
      background: hsl(0 0% 100% / 0.6);
      backdrop-filter: blur(4px);
      border: 1px solid hsl(228 16% 88% / 0.5);
      border-radius: 0.5rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      box-shadow: 0 4px 12px hsl(230 25% 14% / 0.04);
    }

    .card-1 { top: 12%; left: 8%; width: 140px; transform: rotate(-6deg); }
    .card-2 { top: 25%; right: 10%; width: 130px; transform: rotate(4deg); }
    .card-3 { bottom: 20%; left: 12%; width: 120px; transform: rotate(3deg); }
    .card-4 { bottom: 15%; right: 8%; width: 150px; transform: rotate(-4deg); }

    .float-card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .dot-blue { background: hsl(234 89% 63%); }
    .dot-green { background: hsl(152 68% 46%); }
    .dot-purple { background: hsl(280 68% 60%); }
    .dot-orange { background: hsl(36 95% 54%); }

    .float-card-line {
      height: 6px;
      border-radius: 3px;
      background: hsl(228 16% 88% / 0.8);
    }

    .line-long { width: 80%; }
    .line-medium { width: 60%; }
    .line-short { width: 40%; }

    @media (max-width: 768px) {
      .floating-illustration { display: none; }
    }

    /* Auth wrapper */
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
      gap: 0.625rem; margin-bottom: 2rem; text-decoration: none;
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
    :host ::ng-deep .w-full { width: 100%; }
  `]
})
export class SignInComponent {
    signInForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal('');

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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
        if (field?.hasError('required')) return 'This field is required';
        if (field?.hasError('email')) return 'Please enter a valid email';
        if (field?.hasError('minlength')) return 'Password must be at least 6 characters';
        return '';
    }

    onSubmit(): void {
        if (this.signInForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');
            this.authService.login(this.signInForm.value).subscribe({
                next: () => { this.isLoading.set(false); this.router.navigate(['/dashboard']); },
                error: (error) => { this.isLoading.set(false); this.errorMessage.set(error.message || 'Invalid email or password'); }
            });
        } else {
            Object.keys(this.signInForm.controls).forEach(key => { this.signInForm.get(key)?.markAsTouched(); });
        }
    }
}
