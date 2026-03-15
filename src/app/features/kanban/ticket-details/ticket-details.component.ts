import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { KanbanService } from '../kanban.service';
import { ProjectsService } from '../../projects/projects.service';
import { Ticket, TicketPriority } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';
import { Stage } from '../../../core/models/project.model';
import { TextFieldModule } from '@angular/cdk/text-field'; // Import TextFieldModule

@Component({
    selector: 'app-ticket-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, BadgeComponent, AvatarComponent, TextFieldModule], // Add TextFieldModule
    template: `
    <div class="ticket-details-page">
      <div class="details-container">
        <div class="details-header">
          <button class="back-btn" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to Board
          </button>
          <app-button variant="danger" size="sm" (click)="deleteTicket()">
            Delete
          </app-button>
        </div>

        <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()" class="details-form">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input
              type="text"
              formControlName="title"
              class="form-input"
              placeholder="Ticket title"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              formControlName="description"
              class="form-textarea"
              placeholder="Add a description..."
              cdkTextareaAutosize
              cdkAutosizeMinRows="4"
              cdkAutosizeMaxRows="20"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Stage</label>
              <select formControlName="stageId" class="form-input">
                <option *ngFor="let stage of stages()" [value]="stage.id">
                  {{ stage.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Priority</label>
              <select formControlName="priority" class="form-input">
                <option [value]="TicketPriority.LOW">Low</option>
                <option [value]="TicketPriority.MEDIUM">Medium</option>
                <option [value]="TicketPriority.HIGH">High</option>
                <option [value]="TicketPriority.URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Assignee</label>
              <select formControlName="assigneeId" class="form-input">
                <option value="">Unassigned</option>
                <option *ngFor="let member of members()" [value]="member.id">
                  {{ member.fullName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Story Points</label>
              <input
                type="number"
                formControlName="storyPoints"
                class="form-input"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div class="activity-section">
            <h3 class="section-title">Activity</h3>
            <div class="activity-placeholder">
              <p>Activity timeline coming soon...</p>
            </div>
          </div>

          <div class="form-actions">
            <app-button type="button" variant="secondary" (click)="goBack()">
              Cancel
            </app-button>
            <app-button type="submit" variant="primary" [disabled]="isLoading()">
              {{ isLoading() ? 'Saving...' : 'Save Changes' }}
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .ticket-details-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
      padding: var(--spacing-xl);
    }

    .details-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
    }

    .details-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .back-btn:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .details-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      flex: 1;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
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

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    select.form-input {
      cursor: pointer;
    }

    .activity-section {
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--color-border);
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-md);
    }

    .activity-placeholder {
      padding: var(--spacing-xl);
      background-color: var(--color-bg-tertiary);
      border-radius: var(--radius-md);
      text-align: center;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      font-style: italic;
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--color-border);
    }

    @media (max-width: 768px) {
      .ticket-details-page {
        padding: var(--spacing-md);
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
  })
  export class TicketDetailsComponent implements OnInit {
    ticketForm: FormGroup;
    ticket = signal<Ticket | undefined>(undefined);
    stages = signal<Stage[]>([]);
    members = signal<User[]>([]);
    isLoading = signal(false);
    TicketPriority = TicketPriority;

    projectId = '';
    ticketId = '';

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private fb: FormBuilder,
      private kanbanService: KanbanService,
      private projectsService: ProjectsService
    ) {
      this.ticketForm = this.fb.group({
        title: ['', Validators.required],
        description: [''],
        stageId: ['', Validators.required],
        assigneeId: [''],
        storyPoints: [0],
        priority: [TicketPriority.MEDIUM, Validators.required]
      });
    }

    ngOnInit(): void {
      this.projectId = this.route.snapshot.paramMap.get('id') || '';
      this.ticketId = this.route.snapshot.paramMap.get('ticketId') || '';

      this.loadProject();
      this.loadTicket();
      this.loadMembers();
    }

    loadProject(): void {
      this.projectsService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          if (project) {
            this.stages.set(project.stages);
          }
        }
      });
    }

    loadTicket(): void {
      this.kanbanService.getTicketById(this.ticketId).subscribe({
        next: (ticket) => {
          if (ticket) {
            this.ticket.set(ticket);
            this.ticketForm.patchValue({
              title: ticket.title,
              description: ticket.description,
              stageId: ticket.stageId,
              assigneeId: ticket.assigneeId || '',
              storyPoints: ticket.storyPoints || 0,
              priority: ticket.priority
            });
          }
        }
      });
    }

    loadMembers(): void {
      this.kanbanService.getProjectMembers(this.projectId).subscribe({
        next: (members) => {
          this.members.set(members);
        }
      });
    }

    onSubmit(): void {
      if (this.ticketForm.valid) {
        this.isLoading.set(true);
        const formValue = this.ticketForm.value;

        this.kanbanService.updateTicket(this.ticketId, {
          ...formValue,
          assigneeId: formValue.assigneeId || undefined
        }).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.goBack();
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
      }
    }

    deleteTicket(): void {
      if (confirm('Are you sure you want to delete this ticket?')) {
        this.kanbanService.deleteTicket(this.ticketId).subscribe({
          next: () => {
            this.goBack();
          }
        });
      }
    }

    goBack(): void {
      this.router.navigate(['/project', this.projectId]);
    }
  }
