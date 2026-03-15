import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { CreateTicketModalComponent } from '../create-ticket-modal/create-ticket-modal.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProjectsService } from '../../projects/projects.service';
import { KanbanService } from '../kanban.service';
import { AuthService } from '../../auth/auth.service';
import { Project, Stage } from '../../../core/models/project.model';
import { Ticket } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';
import { PopupService } from '../../../shared/services/popup.service';
import { ProjectSettingsModalComponent } from '../../projects/project-settings/project-settings.component';

interface StageWithTickets extends Stage {
  tickets: Ticket[];
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, ButtonComponent, TicketCardComponent, CreateTicketModalComponent, ProjectSettingsModalComponent, NavbarComponent],
  template: `
    <div class="kanban-page">
      <app-navbar 
        [project]="project()" 
        [showBack]="true" 
        (onBack)="goBack()">
        
        <div nav-actions class="nav-actions-group">
          <app-button variant="primary" size="sm" (click)="openCreateTicketModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </app-button>
          <app-button variant="ghost" size="sm" (click)="inviteUser()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Invite
          </app-button>
          <app-button variant="ghost" size="sm" (click)="openProjectSettings()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            Settings
          </app-button>
        </div>
      </app-navbar>

      <main class="kanban-main">
        <div *ngIf="isLoading()" class="loading-state">
          <div class="spinner"></div>
          <p>Loading board...</p>
        </div>

        <div *ngIf="!isLoading()" class="board-container">
          <div class="board-scroll">
            <div class="board-columns" cdkDropListGroup>
              <div *ngFor="let stage of stagesWithTickets(); trackBy: trackByStage; let i = index" 
                   class="board-column animate-fade-in-up"
                   [style.animation-delay]="(0.1 * i) + 's'"
                   style="opacity: 0">
                <!-- Column header -->
                <div class="column-header">
                  <div class="col-dot" [style.background-color]="getColumnDotColor(i)"></div>
                  <span class="column-title">{{ stage.name }}</span>
                  <span class="column-count">{{ stage.tickets.length }}</span>
                </div>

                <!-- Tasks area -->
                <div
                  *ngIf="stage.id"
                  cdkDropList
                  [id]="stage.id"
                  [cdkDropListData]="stage.tickets"
                  (cdkDropListDropped)="onDrop($event)"
                  class="tickets-list"
                  [style.background-color]="getColumnBgColor(i)">
                  <div
                    *ngFor="let ticket of stage.tickets"
                    cdkDrag
                    (click)="openTicketDetails(ticket.id)">
                    <app-ticket-card
                      [ticket]="ticket"
                      [assignee]="getAssignee(ticket.assigneeId)"
                    />
                  </div>

                  <div *ngIf="stage.tickets.length === 0" class="empty-column">
                    No tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <app-create-ticket-modal
        [isOpen]="isCreateModalOpen"
        [projectId]="projectId"
        [stages]="project()?.stages || []"
        [members]="members()"
        (closeModal)="isCreateModalOpen = false"
        (ticketCreated)="onTicketCreated()"
      ></app-create-ticket-modal>

      <app-project-settings-modal
        [isOpen]="isSettingsModalOpen"
        [project]="project()"
        (closeModal)="isSettingsModalOpen = false"
        (projectUpdated)="loadProject()"
      ></app-project-settings-modal>
    </div>
  `,
  styles: [`
    .kanban-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
      display: flex;
      flex-direction: column;
    }

    .nav-actions-group {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .kanban-main {
      flex: 1;
      overflow: hidden;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      gap: 1rem;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .board-container {
      height: 100%;
      overflow: hidden;
    }

    .board-scroll {
      height: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 1.5rem;
    }

    .board-columns {
      display: flex;
      gap: 1.25rem;
      min-height: calc(100vh - 120px);
    }

    .board-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 280px;
    }

    .column-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 0 0.25rem;
    }

    .col-dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 50%;
    }

    .column-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .column-count {
      font-size: 0.6875rem;
      color: var(--color-text-secondary);
      background: var(--color-bg-tertiary);
      border-radius: 9999px;
      padding: 0.125rem 0.5rem;
      font-weight: 500;
      margin-left: auto;
    }

    .tickets-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      border-radius: 0.75rem;
      padding: 0.75rem;
      min-height: 200px;
      transition: all 0.2s ease;
    }

    .empty-column {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 6rem;
      font-size: 0.75rem;
      color: var(--color-text-tertiary);
      border: 2px dashed var(--color-border);
      border-radius: 0.5rem;
    }

    .cdk-drag-preview {
      box-shadow: var(--shadow-card-hover);
      border-radius: 0.5rem;
      opacity: 0.95;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    .cdk-drag-animating {
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    .tickets-list.cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    @media (max-width: 768px) {
      .board-column {
        min-width: 260px;
      }
    }
  `]
})
export class KanbanBoardComponent implements OnInit {
  project = signal<Project | undefined>(undefined);
  stagesWithTickets = signal<StageWithTickets[]>([]);
  members = signal<User[]>([]);
  isLoading = signal(false);
  isCreateModalOpen = false;
  isSettingsModalOpen = false;
  projectId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private kanbanService: KanbanService,
    private authService: AuthService,
    private popupService: PopupService
  ) {
    // Debug effect to trace data
    effect(() => {
      const stages = this.stagesWithTickets();
      console.log('DEBUG CHECK: Stages updated:', stages);
      stages.forEach(s => {
        if (!s.id) console.error('CRITICAL: Stage found without ID:', s);
      });
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.isLoading.set(true);
    this.loadProject();
    this.loadMembers();
  }

  openProjectSettings(): void {
    this.isSettingsModalOpen = true;
  }

  loadProject(): void {
    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loadTickets();
      },
      error: (error) => {
        console.error('Failed to load project:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadTickets(): void {
    this.kanbanService.getTicketsByProject(this.projectId).subscribe({
      next: (tickets) => {
        const stages = this.project()?.stages || [];
        console.log('DEBUG: Stages loaded:', stages);
        const stagesWithTickets: StageWithTickets[] = stages.map(stage => ({
          ...stage,
          tickets: tickets.filter(t => t.stageId === stage.id)
        }));
        console.log('DEBUG: Stages with tickets:', stagesWithTickets);
        this.stagesWithTickets.set(stagesWithTickets);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
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

  getAssignee(assigneeId?: string): User | undefined {
    if (!assigneeId) return undefined;
    return this.members().find(m => m.id === assigneeId);
  }

  trackByStage(index: number, stage: StageWithTickets): string {
    return stage.id;
  }

  getColumnDotColor(index: number): string {
    const colors = [
      'hsl(228 10% 48%)',   // muted for todo
      'hsl(234 89% 63%)',   // primary for in-progress
      'hsl(152 68% 46%)',   // success for done
      'hsl(36 95% 54%)',    // warning 
      'hsl(280 68% 60%)',   // accent
    ];
    return colors[index % colors.length];
  }

  getColumnBgColor(index: number): string {
    const colors = [
      'hsl(228 16% 93% / 0.4)',    // muted/40
      'hsl(234 89% 63% / 0.05)',   // primary/5
      'hsl(152 68% 46% / 0.05)',   // success/5
      'hsl(36 95% 54% / 0.05)',    // warning/5
      'hsl(280 68% 60% / 0.05)',   // accent/5
    ];
    return colors[index % colors.length];
  }

  onDrop(event: CdkDragDrop<Ticket[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const ticket = event.previousContainer.data[event.previousIndex];
      // When using cdkDropListGroup, the container.id is whatever we set it to.
      // We set it to the stage ID directly in the template.
      const newStageId = event.container.id;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update ticket in backend
      this.kanbanService.moveTicket(ticket.id, newStageId).subscribe();
    }
  }

  openTicketDetails(ticketId: string): void {
    this.router.navigate(['/project', this.projectId, 'ticket', ticketId]);
  }

  openCreateTicketModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateTicketModal(): void {
    this.isCreateModalOpen = false;
  }

  onTicketCreated(): void {
    this.loadTickets();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }

  inviteUser(): void {
    this.popupService.prompt(
      'Invite Team Member',
      'Enter the email address of the person you want to invite to this project.',
      'you@example.com',
      (email: string) => {
        this.isLoading.set(true);
        this.kanbanService.inviteUser(this.projectId, { email }).subscribe({
          next: (user) => {
            this.members.update(members => [...members, user]);
            this.isLoading.set(false);
            this.popupService.success(`Invited ${user.fullName} successfully!`);
          },
          error: (error) => {
            this.isLoading.set(false);
            this.popupService.error(error.error?.message || 'Failed to invite user');
          }
        });
      }
    );
  }
}
