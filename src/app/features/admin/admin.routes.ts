import { Routes } from '@angular/router';
import { dashboardResolver } from '@core/resolvers/dashboard.resolver';
import { employeeDetailResolver } from '@core/resolvers/employee-detail.resolver';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes.guard';
import { permissionGuard } from '@core/guards/permission.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    resolve: { stats: dashboardResolver },
    data: { permission: 'dashboard:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
  },
  {
    path: 'employees',
    data: { permission: 'employees:read' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./employees/employee-list/employee-list.component').then((m) => m.EmployeeListComponent)
  },
  {
    path: 'employees/create',
    data: { permission: 'employees:create' },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./employees/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
  },
  {
    path: 'employees/:id',
    resolve: { employee: employeeDetailResolver },
    data: { permission: 'employees:read' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./employees/employee-detail/employee-detail.component').then((m) => m.EmployeeDetailComponent)
  },
  {
    path: 'employees/:id/edit',
    resolve: { employee: employeeDetailResolver },
    data: { permission: 'employees:update' },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./employees/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
  },
  {
    path: 'users',
    data: { permission: 'users:manage' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent)
  },
  {
    path: 'roles',
    data: { permission: 'roles:manage' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./roles/roles.component').then((m) => m.RolesComponent)
  },
  {
    path: 'reports',
    data: { permission: 'reports:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./reports/reports.component').then((m) => m.ReportsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/admin-notifications.component').then((m) => m.AdminNotificationsComponent)
  },
  {
    path: 'audit-logs',
    data: { permission: 'audit:view' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent)
  },
  {
    path: 'settings',
    data: { permission: 'settings:manage' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./settings/settings.component').then((m) => m.SettingsComponent)
  }
];
