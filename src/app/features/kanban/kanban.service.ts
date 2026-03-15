import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Ticket, CreateTicketData, UpdateTicketData, TicketActivity } from '../../core/models/ticket.model';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class KanbanService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    getTicketsByProject(projectId: string): Observable<Ticket[]> {
        return this.http.get<{ status: string, data: Ticket[] }>(`${this.apiUrl}/tickets/projects/${projectId}/tickets`)
            .pipe(map(response => response.data.map(t => ({
                ...t,
                id: t.id || (t as any)._id,
                updatedAt: new Date(t.updatedAt),
                createdAt: new Date(t.createdAt)
            }))));
    }

    getTicketById(ticketId: string): Observable<Ticket> {
        return this.http.get<{ status: string, data: Ticket }>(`${this.apiUrl}/tickets/${ticketId}`)
            .pipe(map(response => ({
                ...response.data,
                id: response.data.id || (response.data as any)._id,
                updatedAt: new Date(response.data.updatedAt),
                createdAt: new Date(response.data.createdAt)
            })));
    }

    createTicket(data: CreateTicketData): Observable<Ticket> {
        const { projectId, ...ticketData } = data;
        return this.http.post<{ status: string, data: Ticket }>(
            `${this.apiUrl}/tickets/projects/${projectId}/tickets`,
            ticketData
        ).pipe(map(response => ({
            ...response.data,
            id: response.data.id || (response.data as any)._id,
            updatedAt: new Date(response.data.updatedAt),
            createdAt: new Date(response.data.createdAt)
        })));
    }

    updateTicket(ticketId: string, data: UpdateTicketData): Observable<Ticket> {
        return this.http.put<{ status: string, data: Ticket }>(`${this.apiUrl}/tickets/${ticketId}`, data)
            .pipe(map(response => ({
                ...response.data,
                id: response.data.id || (response.data as any)._id,
                updatedAt: new Date(response.data.updatedAt),
                createdAt: new Date(response.data.createdAt)
            })));
    }

    deleteTicket(ticketId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tickets/${ticketId}`);
    }

    moveTicket(ticketId: string, newStageId: string): Observable<Ticket> {
        return this.updateTicket(ticketId, { stageId: newStageId });
    }

    getProjectMembers(projectId: string): Observable<User[]> {
        return this.http.get<{ status: string, data: any[] }>(`${this.apiUrl}/members/projects/${projectId}/members`)
            .pipe(map(response => response.data.map(m => ({
                id: m.id,
                fullName: m.fullName,
                email: m.email,
                role: m.role,
                createdAt: new Date() // Date not returned by this endpoint but User model needs it
            }))));
    }

    inviteUser(projectId: string, user: { userId?: string, email?: string, role?: string }): Observable<User> {
        return this.http.post<{ status: string, data: any }>(`${this.apiUrl}/members/projects/${projectId}/members`, user)
            .pipe(map(response => ({
                id: response.data.id,
                fullName: response.data.fullName,
                email: response.data.email,
                role: response.data.projectRole,
                createdAt: new Date()
            })));
    }

    getTicketActivities(ticketId: string): Observable<TicketActivity[]> {
        return this.http.get<{ status: string, data: any[] }>(`${this.apiUrl}/tickets/${ticketId}/activities`)
            .pipe(map(response => response.data.map(a => ({
                ...a,
                createdAt: new Date(a.createdAt)
            }))));
    }
}

