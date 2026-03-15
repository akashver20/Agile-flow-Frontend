import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Project, CreateProjectData } from '../../core/models/project.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/projects`;

    getProjects(): Observable<Project[]> {
        return this.http.get<{ status: string, data: any[] }>(this.apiUrl)
            .pipe(map(response => response.data.map(p => ({
                ...p,
                id: p.id || p._id,
                lastUpdated: new Date(p.updatedAt),
                createdAt: new Date(p.createdAt)
            }))));
    }

    getProjectById(id: string): Observable<Project> {
        return this.http.get<{ status: string, data: any }>(`${this.apiUrl}/${id}`)
            .pipe(map(response => {
                const projectData = response.data;
                const projectId = projectData.id || projectData._id || 'project-' + Math.random().toString(36).substr(2, 9);

                return {
                    ...projectData,
                    id: projectId,
                    stages: (projectData.stages || []).map((stage: any, index: number) => {
                        const stageId = stage.id || stage._id;
                        if (!stageId) {
                            console.warn(`Stage at index ${index} in project ${projectId} has no ID. Generating fallback.`);
                        }
                        return {
                            ...stage,
                            id: stageId || `fallback-stage-${index}-${Date.now()}`
                        };
                    }),
                    lastUpdated: new Date(projectData.updatedAt),
                    createdAt: new Date(projectData.createdAt)
                };
            }));
    }

    createProject(data: CreateProjectData): Observable<Project> {
        // Map frontend data to backend expected format
        const payload = {
            name: data.name,
            description: data.description,
            stages: data.stages.map(name => ({ name }))
        };

        return this.http.post<{ status: string, data: any }>(this.apiUrl, payload)
            .pipe(map(response => ({
                ...response.data,
                lastUpdated: new Date(response.data.updatedAt),
                createdAt: new Date(response.data.createdAt)
            })));
    }

    updateProject(id: string, data: any): Observable<Project> {
        return this.http.put<{ status: string, data: any }>(`${this.apiUrl}/${id}`, data)
            .pipe(map(response => ({
                ...response.data,
                lastUpdated: new Date(response.data.updatedAt),
                createdAt: new Date(response.data.createdAt)
            })));
    }

    deleteProject(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

