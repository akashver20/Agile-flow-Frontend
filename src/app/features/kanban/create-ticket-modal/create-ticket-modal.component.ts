import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { KanbanService } from '../kanban.service';
import { Stage } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';
import { TicketPriority } from '../../../core/models/ticket.model';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-create-ticket-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ModalComponent, ButtonComponent],
    template: `
    <app-modal [isOpen]="isOpen" [title]="'Create New Ticket'" (closeModal)="close()">
      <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
        <div class="form-content">
          <div class="form-group">
            <label for="title" class="form-label">Title *</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              class="form-input"
              [class.error]="isFieldInvalid('title')"
              placeholder="Ticket title"
            />
            <span *ngIf="isFieldInvalid('title')" class="error-message">
              Title is required
            </span>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-textarea"
              placeholder="Add a description..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="stageId" class="form-label">Stage *</label>
              <select id="stageId" formControlName="stageId" class="form-input">
                <option *ngFor="let stage of stages" [value]="stage.id">
                  {{ stage.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority" class="form-label">Priority *</label>
              <select id="priority" formControlName="priority" class="form-input">
                <option [value]="TicketPriority.LOW">Low</option>
                <option [value]="TicketPriority.MEDIUM">Medium</option>
                <option [value]="TicketPriority.HIGH">High</option>
                <option [value]="TicketPriority.URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="assigneeId" class="form-label">Assignee</label>
              <select id="assigneeId" formControlName="assigneeId" class="form-input">
                <option value="">Unassigned</option>
                <option *ngFor="let member of members" [value]="member.id">
                  {{ member.fullName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="storyPoints" class="form-label">Story Points</label>
              <input
                id="storyPoints"
                type="number"
                formControlName="storyPoints"
                class="form-input"
                min="0"
                placeholder="0"
              />
            </div>
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
            [disabled]="isLoading() || ticketForm.invalid"
          >
            {{ isLoading() ? 'Creating...' : 'Create Ticket' }}
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
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

    .form-input.error {
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

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreateTicketModalComponent {
    @Input() isOpen = false;
    @Input() projectId = '';
    @Input() stages: Stage[] = [];
    @Input() members: User[] = [];
    @Output() closeModal = new EventEmitter<void>();
    @Output() ticketCreated = new EventEmitter<void>();

    ticketForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal('');
    TicketPriority = TicketPriority;

    constructor(
        private fb: FormBuilder,
        private kanbanService: KanbanService,
        private authService: AuthService
    ) {
        this.ticketForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            stageId: ['', Validators.required],
            assigneeId: [''],
            priority: [TicketPriority.MEDIUM, Validators.required],
            storyPoints: [0]
        });
    }

    // Set default stage when stages are loaded/changed
    ngOnChanges(): void {
        if (this.stages.length > 0 && !this.ticketForm.get('stageId')?.value) {
            this.ticketForm.patchValue({ stageId: this.stages[0].id });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.ticketForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    close(): void {
        this.ticketForm.reset({
            title: '',
            description: '',
            stageId: this.stages.length > 0 ? this.stages[0].id : '',
            assigneeId: '',
            priority: TicketPriority.MEDIUM,
            storyPoints: 0
        });
        this.errorMessage.set('');
        this.closeModal.emit();
    }

    onSubmit(): void {
        if (this.ticketForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');

            const formValue = this.ticketForm.value;
            const ticketData = {
                projectId: this.projectId,
                title: formValue.title,
                description: formValue.description,
                stageId: formValue.stageId,
                assigneeId: formValue.assigneeId || undefined,
                priority: formValue.priority,
                storyPoints: formValue.storyPoints
            };

            this.kanbanService.createTicket(ticketData).subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.ticketCreated.emit();
                    this.close();
                },
                error: (error) => {
                    this.isLoading.set(false);
                    this.errorMessage.set(error.error?.message || 'Failed to create ticket');
                }
            });
        } else {
            Object.keys(this.ticketForm.controls).forEach(key => {
                this.ticketForm.get(key)?.markAsTouched();
            });
        }
    }
}
