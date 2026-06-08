import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService, PermissionDefinition } from '@core/auth/permission.service';

/**
 * Route-level permission guard.
 * Consumes: string (legacy) or PermissionDefinition object in route.data.permission.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService);
  const router = inject(Router);
  const required = route.data?.['permission'] as PermissionDefinition | string | undefined;

  if (!required) {
    return true;
  }

  let allowed = false;
  if (typeof required === 'string') {
    const [module, action] = required.split(':');
    allowed = permissions.can(module ?? '', action ?? '');
  } else if (required && typeof required === 'object' && 'module' in required && 'action' in required) {
    allowed = permissions.can(required.module, required.action);
  }

  return allowed ? true : router.createUrlTree(['/403']);
};
