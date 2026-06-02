import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';
import { roleGuard } from '@core/guards/role.guard';
import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from '@layouts/employee-layout/employee-layout.component';
import { PublicLayoutComponent } from '@layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    component: PublicLayoutComponent,
    canActivate: [guestGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'], preload: true },
    loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Employee'], preload: true },
    loadChildren: () => import('@features/employee/employee.routes').then((m) => m.EMPLOYEE_ROUTES)
  },
  {
    path: 'account/change-password',
    canActivate: [authGuard],
    loadComponent: () => import('@features/auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent)
  },
  {
    path: '403',
    loadComponent: () => import('@features/errors/forbidden/forbidden.component').then((m) => m.ForbiddenComponent)
  },
  {
    path: '500',
    loadComponent: () => import('@features/errors/server-error/server-error.component').then((m) => m.ServerErrorComponent)
  },
  {
    path: '**',
    loadComponent: () => import('@features/errors/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
