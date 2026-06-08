import { Routes } from '@angular/router';
import { dashboardResolver } from '@core/resolvers/dashboard.resolver';
import { employeeDetailResolver } from '@core/resolvers/employee-detail.resolver';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes.guard';
import { permissionGuard } from '@core/guards/permission.guard';
import { featureFlagGuard } from '@core/guards/feature-flag.guard';
import { PERMISSIONS } from '@core/auth/permission.service';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    resolve: { stats: dashboardResolver },
    data: { permission: PERMISSIONS.DASHBOARD.VIEW, title: 'Dashboard', module: 'dashboard', breadcrumb: 'Dashboard' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
  },
  {
    path: 'employees',
    data: { permission: PERMISSIONS.EMPLOYEES.READ, title: 'Employees', module: 'employees', breadcrumb: 'Employees' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./employees/employee-list/employee-list.component').then((m) => m.EmployeeListComponent)
  },
  {
    path: 'employees/create',
    data: { permission: PERMISSIONS.EMPLOYEES.CREATE, title: 'Create Employee', module: 'employees', breadcrumb: 'Create' },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./employees/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
  },
  {
    path: 'employees/:id',
    resolve: { employee: employeeDetailResolver },
    data: { permission: PERMISSIONS.EMPLOYEES.READ, title: 'Employee Details', module: 'employees', breadcrumb: 'Details' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./employees/employee-detail/employee-detail.component').then((m) => m.EmployeeDetailComponent)
  },
  {
    path: 'employees/:id/edit',
    resolve: { employee: employeeDetailResolver },
    data: { permission: PERMISSIONS.EMPLOYEES.UPDATE, title: 'Edit Employee', module: 'employees', breadcrumb: 'Edit' },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./employees/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
  },
  {
    path: 'users',
    data: { permission: PERMISSIONS.USERS.MANAGE, title: 'Users', module: 'users', breadcrumb: 'Users' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent)
  },
  {
    path: 'roles',
    data: { permission: PERMISSIONS.ROLES.MANAGE, title: 'Roles', module: 'roles', breadcrumb: 'Roles' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./roles/roles.component').then((m) => m.RolesComponent)
  },
  {
    path: 'reports',
    data: { permission: PERMISSIONS.REPORTS.VIEW, title: 'Reports', module: 'reports', breadcrumb: 'Reports' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./reports/reports.component').then((m) => m.ReportsComponent)
  },
  {
    path: 'notifications',
    data: { featureFlag: 'notifications', title: 'Notifications', module: 'notifications', breadcrumb: 'Notifications' },
    canActivate: [featureFlagGuard],
    loadComponent: () => import('./notifications/admin-notifications.component').then((m) => m.AdminNotificationsComponent)
  },
  {
    path: 'audit-logs',
    data: { permission: PERMISSIONS.AUDIT.VIEW, featureFlag: 'auditLogs', title: 'Audit Logs', module: 'audit', breadcrumb: 'Audit Logs' },
    canActivate: [permissionGuard, featureFlagGuard],
    loadComponent: () => import('./audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent)
  },
  {
    path: 'settings',
    data: { permission: PERMISSIONS.SETTINGS.MANAGE, title: 'Settings', module: 'settings', breadcrumb: 'Settings' },
    canActivate: [permissionGuard],
    loadComponent: () => import('./settings/settings.component').then((m) => m.SettingsComponent)
  },
  {
    path: 'profile',
    data: { title: 'Profile', module: 'profile', breadcrumb: 'Profile' },
    loadComponent: () => import('../employee/profile/profile.component').then((m) => m.ProfileComponent)
  }
];
