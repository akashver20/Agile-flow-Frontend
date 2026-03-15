import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="sidebar-logo" *ngIf="!collapsed">
          <div class="logo-icon">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M8 12H24M8 16H24M8 20H16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">TaskFlow</span>
        </div>
        <button class="btn-collapse" (click)="toggleCollapse()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line *ngIf="!collapsed" x1="3" y1="6" x2="21" y2="6"></line>
            <line *ngIf="!collapsed" x1="3" y1="12" x2="21" y2="12"></line>
            <line *ngIf="!collapsed" x1="3" y1="18" x2="21" y2="18"></line>
            <line *ngIf="collapsed" x1="3" y1="6" x2="21" y2="6"></line>
            <line *ngIf="collapsed" x1="3" y1="12" x2="21" y2="12"></line>
            <line *ngIf="collapsed" x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <a class="nav-item active" (click)="navigateTo('/dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <rect x="3" y="4" width="7" height="7" rx="1"/>
            <rect x="14" y="4" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span *ngIf="!collapsed" class="nav-label">Projects</span>
        </a>
        <a class="nav-item" (click)="navigateTo('/dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span *ngIf="!collapsed" class="nav-label">My Tasks</span>
        </a>
        <a class="nav-item" (click)="navigateTo('/dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
          <span *ngIf="!collapsed" class="nav-label">Backlog</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span *ngIf="!collapsed" class="nav-label">Settings</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: #0f172a;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideInLeft {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      height: 64px;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 1.125rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.02em;
    }

    .btn-collapse {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: #64748b;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-collapse:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: white;
    }

    .nav-item.active {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
    }

    .nav-label {
      white-space: nowrap;
      overflow: hidden;
    }

    .sidebar-footer {
      padding: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
  `]
})
export class SidebarComponent {
  collapsed = false;

  constructor(private router: Router) {}

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
