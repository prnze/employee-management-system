import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@core/auth/auth-state.service';

export const guestGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const role = authState.role();
  if (!authState.isAuthenticated() || !role) {
    return true;
  }
  return router.createUrlTree([role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard']);
};
