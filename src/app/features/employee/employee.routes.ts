import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes.guard';
import { permissionGuard } from '@core/guards/permission.guard';

export const EMPLOYEE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    data: { permission: 'dashboard:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./dashboard/employee-dashboard.component').then((m) => m.EmployeeDashboardComponent)
  },
  {
    path: 'profile',
    data: { permission: 'profile:update' },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'attendance',
    data: { permission: 'attendance:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./attendance/attendance.component').then((m) => m.AttendanceComponent)
  },
  {
    path: 'tasks',
    data: { permission: 'tasks:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./tasks/tasks.component').then((m) => m.TasksComponent)
  },
  {
    path: 'notifications',
    data: { permission: 'notifications:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./notifications/employee-notifications.component').then((m) => m.EmployeeNotificationsComponent)
  }
];
