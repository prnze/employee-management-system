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
  selector: 'app-employee-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent],
  styleUrl: './employee-layout.component.scss',
  templateUrl: './employee-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeLayoutComponent {
  readonly shell = inject(ShellStateService);
  readonly items: NavItem[] = [
    { label: 'NAV_DASHBOARD',     path: '/employee/dashboard',     icon: APP_ICONS.DASHBOARD, permission: PERMISSIONS.DASHBOARD.VIEW },
    { label: 'NAV_PROFILE',       path: '/employee/profile',       icon: APP_ICONS.EMPLOYEE, permission: PERMISSIONS.PROFILE.UPDATE },
    { label: 'NAV_ATTENDANCE',    path: '/employee/attendance',    icon: APP_ICONS.CALENDAR, permission: PERMISSIONS.ATTENDANCE.VIEW },
    { label: 'NAV_TASKS',         path: '/employee/tasks',         icon: APP_ICONS.TASKS, permission: PERMISSIONS.TASKS.VIEW },
    { label: 'NAV_NOTIFICATIONS', path: '/employee/notifications', icon: APP_ICONS.NOTIFICATIONS, permission: PERMISSIONS.NOTIFICATIONS.VIEW, featureFlag: 'notifications' }
  ];
}
