import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes.guard';
import { permissionGuard } from '@core/guards/permission.guard';
import { featureFlagGuard } from '@core/guards/feature-flag.guard';
import { PERMISSIONS } from '@core/auth/permission.service';

export const EMPLOYEE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    data: { permission: PERMISSIONS.DASHBOARD.VIEW, title: 'Dashboard', module: 'dashboard', breadcrumb: 'Dashboard' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./dashboard/employee-dashboard.component').then((m) => m.EmployeeDashboardComponent)
  },
  {
    path: 'profile',
    data: { permission: PERMISSIONS.PROFILE.UPDATE, title: 'Profile', module: 'profile', breadcrumb: 'Profile' },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'attendance',
    data: { permission: PERMISSIONS.ATTENDANCE.VIEW, title: 'Attendance', module: 'attendance', breadcrumb: 'Attendance' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./attendance/attendance.component').then((m) => m.AttendanceComponent)
  },
  {
    path: 'tasks',
    data: { permission: PERMISSIONS.TASKS.VIEW, title: 'Tasks', module: 'tasks', breadcrumb: 'Tasks' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./tasks/tasks.component').then((m) => m.TasksComponent)
  },
  {
    path: 'notifications',
    data: { permission: PERMISSIONS.NOTIFICATIONS.VIEW, featureFlag: 'notifications', title: 'Notifications', module: 'notifications', breadcrumb: 'Notifications' },
    canActivate: [permissionGuard, featureFlagGuard],
    loadComponent: () => import('./notifications/employee-notifications.component').then((m) => m.EmployeeNotificationsComponent)
  }
];
