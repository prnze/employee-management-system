import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../layout-components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../layout-components/footer/footer.component';
import { NavItem, SidebarComponent } from '../layout-components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../layout-components/top-navbar/top-navbar.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { PERMISSIONS } from '@core/auth/permission.service';
import { ShellStateService } from '@core/services/shell-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent],
  styleUrl: './admin-layout.component.scss',
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  readonly shell = inject(ShellStateService);
  readonly items: NavItem[] = [
    { label: 'NAV_DASHBOARD',     path: '/admin/dashboard',     icon: APP_ICONS.DASHBOARD, permission: PERMISSIONS.DASHBOARD.VIEW },
    { label: 'NAV_EMPLOYEES',     path: '/admin/employees',     icon: APP_ICONS.USERS, permission: PERMISSIONS.EMPLOYEES.READ },
    { label: 'NAV_USERS',         path: '/admin/users',         icon: APP_ICONS.USER, permission: PERMISSIONS.USERS.MANAGE },
    { label: 'NAV_ROLES',         path: '/admin/roles',         icon: APP_ICONS.ROLE, permission: PERMISSIONS.ROLES.MANAGE },
    { label: 'NAV_REPORTS',       path: '/admin/reports',       icon: APP_ICONS.REPORTS, permission: PERMISSIONS.REPORTS.VIEW },
    { label: 'NAV_NOTIFICATIONS', path: '/admin/notifications', icon: APP_ICONS.NOTIFICATIONS, featureFlag: 'notifications' },
    { label: 'NAV_AUDIT_LOGS',    path: '/admin/audit-logs',   icon: APP_ICONS.AUDIT, permission: PERMISSIONS.AUDIT.VIEW, featureFlag: 'auditLogs' },
    { label: 'NAV_SETTINGS',      path: '/admin/settings',     icon: APP_ICONS.SETTINGS, permission: PERMISSIONS.SETTINGS.MANAGE }
  ];
}
