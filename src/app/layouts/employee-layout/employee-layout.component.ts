import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../layout-components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../layout-components/footer/footer.component';
import { NavItem, SidebarComponent } from '../layout-components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../layout-components/top-navbar/top-navbar.component';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent],
  styles: [`.desktop-sidebar { width: var(--app-sidebar-width); }`],
  template: `
    <div class="d-flex min-vh-100">
      <div class="desktop-sidebar d-none d-lg-block"><app-sidebar [items]="items" /></div>
      <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
        <div class="offcanvas-header">
          <h2 class="offcanvas-title fs-5" id="mobileSidebarLabel">Navigation</h2>
          <button class="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0"><app-sidebar [items]="items" /></div>
      </div>
      <div class="flex-grow-1 d-flex flex-column">
        <app-top-navbar />
        <app-breadcrumb />
        <main id="main-content" class="app-page flex-grow-1"><router-outlet /></main>
        <app-footer />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeLayoutComponent {
  readonly items: NavItem[] = [
    { label: 'Dashboard',     path: '/employee/dashboard',      icon: '📊', permission: 'dashboard:view' },
    { label: 'Profile',       path: '/employee/profile',        icon: '🪪', permission: 'profile:update' },
    { label: 'Attendance',    path: '/employee/attendance',     icon: '📅', permission: 'attendance:view' },
    { label: 'Tasks',         path: '/employee/tasks',          icon: '✅', permission: 'tasks:view' },
    { label: 'Notifications', path: '/employee/notifications',  icon: '🔔', permission: 'notifications:view' }
  ];
}
