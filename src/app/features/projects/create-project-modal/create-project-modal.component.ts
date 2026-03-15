import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ProjectsService } from '../projects.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal [isOpen]="isOpen" [title]="'Create New Project'" (closeModal)="close()">
      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <div class="form-content">
          <div class="form-group">
            <label for="name" class="form-label">Project Name *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="form-input"
              [class.error]="isFieldInvalid('name')"
              placeholder="Enter project name"
            />
            <span *ngIf="isFieldInvalid('name')" class="error-message">
              Project name is required
            </span>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description *</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-textarea"
              [class.error]="isFieldInvalid('description')"
              placeholder="Describe your project"
              rows="3"
            ></textarea>
            <span *ngIf="isFieldInvalid('description')" class="error-message">
              Description is required
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Stages *</label>
            <div class="stages-list" formArrayName="stages">
              <div *ngFor="let stage of stages.controls; let i = index" class="stage-item">
                <input
                  type="text"
                  [formControlName]="i"
                  class="form-input"
                  placeholder="Stage name"
                />
                <button
                  type="button"
                  class="remove-btn"
                  (click)="removeStage(i)"
                  [disabled]="stages.length <= 1"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <app-button
              type="button"
              variant="ghost"
              size="sm"
              (click)="addStage()"
              customClass="add-stage-btn"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Add Stage
            </app-button>
          </div>

          <div *ngIf="errorMessage()" class="error-banner">
            {{ errorMessage() }}
          </div>
        </div>

        <div class="modal-actions">
          <app-button type="button" variant="secondary" (click)="close()">
            Cancel
          </app-button>
          <app-button
            type="submit"
            variant="primary"
            [disabled]="isLoading() || projectForm.invalid"
          >
            {{ isLoading() ? 'Creating...' : 'Create Project' }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-content {
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

    .form-input,
    .form-textarea {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      transition: all var(--transition-base);
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .form-input.error,
    .form-textarea.error {
      border-color: var(--color-danger);
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .error-message {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }

    .stages-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .stage-item {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .stage-item .form-input {
      flex: 1;
    }

    .remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .remove-btn:hover:not(:disabled) {
      background-color: #fee2e2;
      color: var(--color-danger);
    }

    .remove-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .error-banner {
      padding: var(--spacing-md);
      background-color: #fee2e2;
      color: var(--color-danger);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      text-align: center;
    }

    .modal-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--color-border);
    }

    :host ::ng-deep .add-stage-btn {
      width: 100%;
      justify-content: center;
    }
  `]
})
export class CreateProjectModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<void>();

  projectForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      stages: this.fb.array([
        this.fb.control('To Do', Validators.required),
        this.fb.control('In Progress', Validators.required),
        this.fb.control('Done', Validators.required)
      ])
    });
  }

  get stages(): FormArray {
    return this.projectForm.get('stages') as FormArray;
  }

  addStage(): void {
    this.stages.push(this.fb.control('', Validators.required));
  }

  removeStage(index: number): void {
    if (this.stages.length > 1) {
      this.stages.removeAt(index);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  close(): void {
    this.projectForm.reset({
      name: '',
      description: '',
      stages: ['To Do', 'In Progress', 'Done']
    });
    this.errorMessage.set('');
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const userId = this.authService.currentUser()?.id || '1';
      const formValue = this.projectForm.value;

      this.projectsService.createProject(formValue).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.projectCreated.emit();
          this.close();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message || 'Failed to create project');
        }
      });
    } else {
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
    }
  }
}
