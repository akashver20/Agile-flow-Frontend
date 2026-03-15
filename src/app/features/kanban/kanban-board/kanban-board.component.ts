import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { CreateTicketModalComponent } from '../create-ticket-modal/create-ticket-modal.component';
import { ProjectsService } from '../../projects/projects.service';
import { KanbanService } from '../kanban.service';
import { AuthService } from '../../auth/auth.service';
import { Project, Stage } from '../../../core/models/project.model';
import { Ticket } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';

interface StageWithTickets extends Stage {
  tickets: Ticket[];
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, ButtonComponent, TicketCardComponent, CreateTicketModalComponent],
  template: `
    <div class="kanban-page">
      <header class="kanban-header">
        <div class="container">
          <div class="header-content">
            <div class="header-left">
              <button class="back-btn" (click)="goBack()">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div>
                <h1 class="project-name">{{ project()?.name }}</h1>
                <p class="project-description">{{ project()?.description }}</p>
              </div>
            </div>
            <div class="header-right">
              <app-button variant="primary" size="sm" (click)="openCreateTicketModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Create Ticket
              </app-button>
              <app-button variant="secondary" size="sm" (click)="inviteUser()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Invite User
              </app-button>
              <app-button variant="ghost" size="sm" (click)="logout()">
                Logout
              </app-button>
            </div>
          </div>
        </div>
      </header>

      <main class="kanban-main">
        <div *ngIf="isLoading()" class="loading-state">
          <div class="spinner"></div>
          <p>Loading board...</p>
        </div>

        <div *ngIf="!isLoading()" class="board-container">
          <div class="board-scroll">
            <div class="board-columns" cdkDropListGroup>
              <div *ngFor="let stage of stagesWithTickets(); trackBy: trackByStage" class="board-column">
                <div class="column-header">
                  <h3 class="column-title">{{ stage.name }}</h3>
                  <span class="column-count">{{ stage.tickets.length }}</span>
                </div>

                <div
                  *ngIf="stage.id"
                  cdkDropList
                  [id]="stage.id"
                  [cdkDropListData]="stage.tickets"
                  (cdkDropListDropped)="onDrop($event)"
                  class="tickets-list"
                >
                  <div
                    *ngFor="let ticket of stage.tickets"
                    cdkDrag
                    (click)="openTicketDetails(ticket.id)"
                  >
                    <app-ticket-card
                      [ticket]="ticket"
                      [assignee]="getAssignee(ticket.assigneeId)"
                    />
                  </div>

                  <div *ngIf="stage.tickets.length === 0" class="empty-column">
                    <p>No tickets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <app-create-ticket-modal
        [isOpen]="isCreateTicketModalOpen()"
        [projectId]="projectId"
        [stages]="project()?.stages || []"
        [members]="members()"
        (closeModal)="closeCreateTicketModal()"
        (ticketCreated)="onTicketCreated()"
      ></app-create-ticket-modal>
    </div>
  `,
  styles: [`
    .kanban-page {
      min-height: 100vh;
      background-color: var(--color-bg-secondary);
      display: flex;
      flex-direction: column;
    }

    .kanban-header {
      background-color: var(--color-bg-primary);
      border-bottom: 1px solid var(--color-border);
      padding: var(--spacing-lg) 0;
      flex-shrink: 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex: 1;
      min-width: 0;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .back-btn:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .project-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .project-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .header-right {
      display: flex;
      gap: var(--spacing-sm);
      flex-shrink: 0;
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
      padding: var(--spacing-3xl);
      gap: var(--spacing-lg);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .board-container {
      height: 100%;
      overflow: hidden;
    }

    .board-scroll {
      height: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding: var(--spacing-lg) 0;
    }

    .board-columns {
      display: flex;
      gap: var(--spacing-lg);
      padding: 0 var(--spacing-lg);
      min-height: calc(100vh - 120px);
    }

    .board-column {
      flex: 0 0 320px;
      display: flex;
      flex-direction: column;
      background-color: var(--color-bg-tertiary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      max-height: calc(100vh - 140px);
    }

    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-sm);
      border-bottom: 2px solid var(--color-border);
    }

    .column-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .column-count {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 var(--spacing-xs);
      background-color: var(--color-gray-200);
      color: var(--color-text-secondary);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
    }

    .tickets-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      min-height: 100px;
    }

    .empty-column {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      font-style: italic;
    }

    .cdk-drag-preview {
      box-shadow: var(--shadow-xl);
      opacity: 0.9;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .tickets-list.cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .board-column {
        flex: 0 0 280px;
      }
    }
  `]
})
export class KanbanBoardComponent implements OnInit {
  project = signal<Project | undefined>(undefined);
  stagesWithTickets = signal<StageWithTickets[]>([]);
  members = signal<User[]>([]);
  isLoading = signal(false);
  isCreateTicketModalOpen = signal(false);
  projectId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private kanbanService: KanbanService,
    private authService: AuthService
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
    this.isCreateTicketModalOpen.set(true);
  }

  closeCreateTicketModal(): void {
    this.isCreateTicketModalOpen.set(false);
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
    const email = prompt('Enter email address of the user to invite:');
    if (email && email.trim()) {
      this.isLoading.set(true);
      this.kanbanService.inviteUser(this.projectId, { email: email.trim() }).subscribe({
        next: (user) => {
          this.members.update(members => [...members, user]);
          this.isLoading.set(false);
          alert(`Invited ${user.fullName} successfully!`);
        },
        error: (error) => {
          this.isLoading.set(false);
          alert(error.error?.message || 'Failed to invite user');
        }
      });
    }
  }
}
