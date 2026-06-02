import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '@core/auth/permissions.service';

/**
 * Route-level permission guard.
 * Usage: add `data: { permission: 'employees:create' }` to a route,
 * then include `permissionGuard` in its `canActivate` array.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  const required = route.data?.['permission'] as string | undefined;
  if (!required || permissions.hasPermission(required)) {
    return true;
  }
  return router.createUrlTree(['/403']);
};
