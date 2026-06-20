import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@core/auth/auth-state.service';

export const guestGuard: CanActivateFn = (_route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const role = authState.role();
  if (!authState.isAuthenticated() || !role) {
    return true;
  }
  if (state.url.includes('change-password')) {
    return true;
  }
  return router.createUrlTree([role === 'Admin' ? '/ems/admin/dashboard' : '/ems/employee/dashboard']);
};
