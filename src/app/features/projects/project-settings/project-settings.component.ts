import { Component, Input, Output, EventEmitter, signal, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ProjectsService } from '../projects.service';
import { Project, Stage } from '../../../core/models/project.model';
import { PopupService } from '../../../shared/services/popup.service';

@Component({
  selector: 'app-project-settings-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal [isOpen]="isOpen" [title]="'Project Settings'" (closeModal)="close()">
      <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
        <div class="settings-content">
          <!-- General Info -->
          <div class="section-group">
            <h4 class="section-title">General Information</h4>
            <div class="form-group">
              <label for="name" class="form-label">Project Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="form-input"
                [class.error]="isFieldInvalid('name')"
                placeholder="Enter project name"
              />
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-textarea"
                [class.error]="isFieldInvalid('description')"
                placeholder="Describe your project"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Stages Management -->
          <div class="section-group">
            <h4 class="section-title">Workflow Stages</h4>
            <p class="section-hint">Drag to reorder stages. New tickets start in the first stage.</p>
            
            <div class="stages-container" cdkDropList (cdkDropListDropped)="onStageDrop($event)" formArrayName="stages">
              <div *ngFor="let stageGroup of stages.controls; let i = index" 
                   class="stage-row" 
                   cdkDrag 
                   [formGroupName]="i">
                <div class="drag-handle" cdkDragHandle>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                    <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                  </svg>
                </div>
                
                <input
                  type="text"
                  formControlName="name"
                  class="form-input stage-name-input"
                  [class.error]="stageGroup.get('name')?.invalid && stageGroup.get('name')?.touched"
                  placeholder="Stage name"
                />
                
                <button
                  type="button"
                  class="remove-btn"
                  (click)="removeStage(i)"
                  [disabled]="stages.length <= 1"
                  title="Remove stage"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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
            [disabled]="isLoading() || settingsForm.invalid"
          >
            {{ isLoading() ? 'Saving...' : 'Save Changes' }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .section-hint {
      font-size: 0.75rem;
      color: var(--color-text-tertiary);
      margin-top: -0.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.625rem 0.875rem;
      font-size: 0.875rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .stages-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stage-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: box-shadow 0.2s ease;
    }

    .cdk-drag-preview {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      background: white;
    }

    .drag-handle {
      cursor: grab;
      color: var(--color-text-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stage-name-input {
      border-color: transparent;
      background: transparent;
      padding: 0.375rem 0.5rem;
    }

    .stage-name-input:focus {
      background: var(--color-bg-primary);
      border-color: var(--color-primary);
    }

    .remove-btn {
      color: var(--color-text-tertiary);
      background: none;
      border: none;
      padding: 0.375rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .remove-btn:hover:not(:disabled) {
      color: var(--color-danger);
      background: #fee2e2;
    }

    .remove-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .add-stage-btn {
      margin-top: 0.5rem;
      width: 100%;
      justify-content: center;
      border-style: dashed;
    }

    .error-banner {
      padding: 0.75rem 1rem;
      background-color: #fee2e2;
      color: var(--color-danger);
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class ProjectSettingsModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() project?: Project;
  @Output() closeModal = new EventEmitter<void>();
  @Output() projectUpdated = new EventEmitter<void>();

  settingsForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private popupService: PopupService
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      stages: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.initForm();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen && this.project) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (!this.project) return;

    this.settingsForm.patchValue({
      name: this.project.name,
      description: this.project.description
    });

    const stagesArray = this.fb.array(
      this.project.stages.map(stage => this.fb.group({
        id: [stage.id],
        name: [stage.name, Validators.required]
      }))
    );
    this.settingsForm.setControl('stages', stagesArray);
  }

  get stages(): FormArray {
    return this.settingsForm.get('stages') as FormArray;
  }

  addStage(): void {
    this.stages.push(this.fb.group({
      id: [null],
      name: ['', Validators.required]
    }));
  }

  removeStage(index: number): void {
    const stage = this.stages.at(index).value;
    if (stage.id) {
      this.popupService.confirm(
        'Are you sure you want to remove this stage? You will only be able to save if the stage is empty of tasks.',
        () => {
          this.stages.removeAt(index);
          this.popupService.closeConfirm();
        }
      );
    } else {
      this.stages.removeAt(index);
    }
  }

  onStageDrop(event: CdkDragDrop<string[]>): void {
    const dir = event.previousIndex > event.currentIndex ? -1 : 1;
    const from = event.previousIndex;
    const to = event.currentIndex;

    const control = this.stages.at(from);
    this.stages.removeAt(from);
    this.stages.insert(to, control);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  close(): void {
    this.errorMessage.set('');
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.settingsForm.valid && this.project) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const formValue = this.settingsForm.value;

      this.projectsService.updateProject(this.project.id, formValue).subscribe({
        next: (updatedProject) => {
          console.log('Project updated successfully:', updatedProject);
          this.isLoading.set(false);
          this.popupService.success('Project settings updated successfully');
          this.projectUpdated.emit();
          this.close();
        },
        error: (error) => {
          console.error('Project update error:', error);
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Failed to update project settings');
        }
      });
    } else {
      console.warn('Form validation failed:', this.settingsForm.value, this.settingsForm.errors);
      this.settingsForm.markAllAsTouched();
    }
  }
}
