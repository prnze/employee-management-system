import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';
import { roleGuard } from '@core/guards/role.guard';
import { AuthStateService } from '@core/auth/auth-state.service';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@features/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'ems',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login'
      },
      {
        path: 'login',
        pathMatch: 'full',
        redirectTo: 'auth/login'
      },
      {
        path: 'dashboard',
        redirectTo: () => {
          const auth = inject(AuthStateService);
          return auth.role() === 'Admin' ? '/ems/admin/dashboard' : '/ems/employee/dashboard';
        }
      },
      {
        path: 'auth',
        canActivate: [guestGuard],
        loadComponent: () => import('@layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
        loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
      },
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'], preload: true, breadcrumb: 'Admin' },
        loadComponent: () => import('@layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
        loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      },
      {
        path: 'employee',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Employee'], preload: true, breadcrumb: 'Employee' },
        loadComponent: () => import('@layouts/employee-layout/employee-layout.component').then((m) => m.EmployeeLayoutComponent),
        loadChildren: () => import('@features/employee/employee.routes').then((m) => m.EMPLOYEE_ROUTES)
      }
    ]
  },
  { path: 'login', pathMatch: 'full', redirectTo: 'ems/login' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('@layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'], preload: true, breadcrumb: 'Admin' },
    loadComponent: () => import('@layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Employee'], preload: true, breadcrumb: 'Employee' },
    loadComponent: () => import('@layouts/employee-layout/employee-layout.component').then((m) => m.EmployeeLayoutComponent),
    loadChildren: () => import('@features/employee/employee.routes').then((m) => m.EMPLOYEE_ROUTES)
  },
  {
    path: 'sharex',
    loadChildren: () => import('@features/sharex/sharex.routes').then((m) => m.SHAREX_ROUTES)
  },
  {
    path: 'passx',
    loadChildren: () => import('@features/passx/passx.routes').then((m) => m.PASSX_ROUTES)
  },
  {
    path: 'formatx',
    loadChildren: () => import('@features/formatx/formatx.routes').then((m) => m.FORMATX_ROUTES)
  },
  {
    path: 'profile',
    redirectTo: () => {
      const auth = inject(AuthStateService);
      return auth.role() === 'Admin' ? '/ems/admin/profile' : '/ems/employee/profile';
    }
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
