import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../layout-components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../layout-components/footer/footer.component';
import { NavItem, SidebarComponent } from '../layout-components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../layout-components/top-navbar/top-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent],
  styles: [`
    .shell { min-height: 100vh; }
    .desktop-sidebar { width: var(--app-sidebar-width); }
  `],
  template: `
    <div class="shell d-flex">
      <div class="desktop-sidebar d-none d-lg-block"><app-sidebar [items]="items" /></div>
      <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
        <div class="offcanvas-header">
          <h2 class="offcanvas-title fs-5" id="mobileSidebarLabel">Navigation</h2>
          <button class="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0"><app-sidebar [items]="items" /></div>
      </div>
      <div class="flex-grow-1 d-flex flex-column min-vh-100">
        <app-top-navbar />
        <app-breadcrumb />
        <main id="main-content" class="app-page flex-grow-1"><router-outlet /></main>
        <app-footer />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  readonly items: NavItem[] = [
    { label: 'NAV_DASHBOARD',     path: '/admin/dashboard',     icon: '📊', permission: 'dashboard:view' },
    { label: 'NAV_EMPLOYEES',     path: '/admin/employees',     icon: '👥', permission: 'employees:read' },
    { label: 'NAV_USERS',         path: '/admin/users',         icon: '👤', permission: 'users:manage' },
    { label: 'NAV_ROLES',         path: '/admin/roles',         icon: '🔑', permission: 'roles:manage' },
    { label: 'NAV_REPORTS',       path: '/admin/reports',       icon: '📄', permission: 'reports:view' },
    { label: 'NAV_NOTIFICATIONS', path: '/admin/notifications', icon: '🔔' },
    { label: 'NAV_AUDIT_LOGS',    path: '/admin/audit-logs',   icon: '🔍', permission: 'audit:view' },
    { label: 'NAV_SETTINGS',      path: '/admin/settings',     icon: '⚙️', permission: 'settings:manage' }
  ];
}
