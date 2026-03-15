import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./features/auth/sign-in/sign-in.component').then(m => m.SignInComponent)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/projects/project-dashboard/project-dashboard.component').then(m => m.ProjectDashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'project/:id',
        loadComponent: () => import('./features/kanban/kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'project/:id/ticket/:ticketId',
        loadComponent: () => import('./features/kanban/ticket-details/ticket-details.component').then(m => m.TicketDetailsComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
