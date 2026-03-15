import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { User, AuthResponse, LoginCredentials, SignUpData } from '../../core/models/user.model';
import { StorageService } from '../../core/services/storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private storageService = inject(StorageService);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;

    currentUser = signal<User | null>(null);

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const user = this.storageService.getUser();
        if (user) {
            this.currentUser.set(user);
        }
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<{ status: string, data: AuthResponse }>(`${this.apiUrl}/login`, credentials)
            .pipe(
                map(response => response.data),
                tap(response => {
                    this.storageService.setToken(response.token);
                    this.storageService.setUser(response.user);
                    this.currentUser.set(response.user);
                })
            );
    }

    signUp(data: SignUpData): Observable<AuthResponse> {
        return this.http.post<{ status: string, data: AuthResponse }>(`${this.apiUrl}/signup`, data)
            .pipe(
                map(response => response.data),
                tap(response => {
                    this.storageService.setToken(response.token);
                    this.storageService.setUser(response.user);
                    this.currentUser.set(response.user);
                })
            );
    }

    logout(): void {
        this.storageService.clear();
        this.currentUser.set(null);
        this.router.navigate(['/sign-in']);
    }

    isAuthenticated(): boolean {
        return !!this.storageService.getToken();
    }
}

