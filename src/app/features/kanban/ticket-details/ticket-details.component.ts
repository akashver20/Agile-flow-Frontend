import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { KanbanService } from '../kanban.service';
import { ProjectsService } from '../../projects/projects.service';
import { Ticket, TicketPriority, TicketActivity } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';
import { Stage, Project } from '../../../core/models/project.model';
import { TextFieldModule } from '@angular/cdk/text-field';
import { PopupService } from '../../../shared/services/popup.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-ticket-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, BadgeComponent, AvatarComponent, TextFieldModule, NavbarComponent],
    template: `
    <div class="ticket-details-page">
      <app-navbar
        [project]="project()"
        [showBack]="true"
        (onBack)="goBack()">
      </app-navbar>

      <div class="details-container animate-fade-in-up" style="opacity: 0; animation-delay: 0.1s">

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
            <h3 class="section-title">Activity Timeline</h3>
            <div class="timeline" *ngIf="activities().length > 0; else noActivities">
              <div *ngFor="let activity of activities(); let i = index" class="timeline-item animate-fade-in-up" [style.animation-delay]="i * 0.1 + 's'">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="timeline-user">{{ activity.user.fullName }}</span>
                    <span class="timeline-time">{{ activity.createdAt | date:'MMM d, y, h:mm a' }}</span>
                  </div>
                  <div class="timeline-action">
                    <ng-container [ngSwitch]="activity.actionType">
                      <span *ngSwitchCase="'CREATED'">created this ticket.</span>
                      <span *ngSwitchCase="'UPDATED_STAGE'">moved ticket to <strong>{{ getStageName(activity.newValue!) }}</strong>.</span>
                      <span *ngSwitchCase="'UPDATED_PRIORITY'">changed priority to <strong>{{ activity.newValue }}</strong>.</span>
                      <span *ngSwitchCase="'UPDATED_STORY_POINTS'">updated story points to <strong>{{ activity.newValue }}</strong>.</span>
                      <span *ngSwitchCase="'UPDATED_TITLE'">updated the title.</span>
                      <span *ngSwitchCase="'UPDATED_DESCRIPTION'">updated the description.</span>
                      <span *ngSwitchCase="'UPDATED_ASSIGNEE'">
                        <ng-container *ngIf="activity.newValue; else unassigned">
                          assigned this to <strong>{{ getUserName(activity.newValue) }}</strong>.
                        </ng-container>
                        <ng-template #unassigned>unassigned this ticket.</ng-template>
                      </span>
                      <span *ngSwitchDefault>updated the ticket.</span>
                    </ng-container>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #noActivities>
              <div class="activity-placeholder">
                <p>No activity yet.</p>
              </div>
            </ng-template>
          </div>

          <div class="form-actions">
            <app-button type="button" variant="secondary" (click)="goBack()">
              Cancel
            </app-button>
            <app-button variant="danger" size="sm" (click)="deleteTicket()">
              Delete
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
    }

    .details-container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-xl) 1.5rem;
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
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-xl);
      border-top: 1px solid var(--color-border);
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-md);
      font-family: 'JetBrains Mono', monospace;
    }

    .timeline {
      position: relative;
      margin-left: 0.5rem;
      padding-left: 1.5rem;
      border-left: 2px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .timeline-item {
      position: relative;
    }

    .timeline-marker {
      position: absolute;
      left: -1.5rem;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-bg-primary);
      border: 2px solid var(--color-primary);
      top: 0.25rem;
    }

    .timeline-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .timeline-user {
      font-weight: 600;
      color: var(--color-text-primary);
      font-size: 0.875rem;
    }

    .timeline-time {
      color: var(--color-text-tertiary);
      font-size: 0.75rem;
    }

    .timeline-action {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .timeline-action strong {
      color: var(--color-text-primary);
      font-weight: 600;
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
    project = signal<Project | undefined>(undefined);
    ticket = signal<Ticket | undefined>(undefined);
    activities = signal<TicketActivity[]>([]);
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
      private projectsService: ProjectsService,
      private popupService: PopupService
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
      this.loadActivities();
      this.loadMembers();
    }

    loadProject(): void {
      this.projectsService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          if (project) {
            this.project.set(project);
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

    loadActivities(): void {
      this.kanbanService.getTicketActivities(this.ticketId).subscribe({
        next: (activities) => {
          this.activities.set(activities);
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
      this.popupService.confirm(
        'Are you sure you want to delete this ticket?',
        () => {
          this.kanbanService.deleteTicket(this.ticketId).subscribe({
            next: () => {
              this.popupService.success('Ticket deleted successfully');
              this.goBack();
            }
          });
        }
      );
    }

    goBack(): void {
      this.router.navigate(['/project', this.projectId]);
    }

    getStageName(stageId: string): string {
      const stage = this.stages().find(s => String(s.id) === String(stageId));
      return stage ? stage.name : 'Unknown Stage';
    }

    getUserName(userId: string): string {
      const user = this.members().find(u => String(u.id) === String(userId));
      return user ? user.fullName : 'Unknown User';
    }
  }
