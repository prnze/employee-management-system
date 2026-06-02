import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '@core/auth/permissions.service';
import { AppRole } from '@core/constants/roles.constant';

export const roleGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] ?? []) as AppRole[];
  return permissions.hasRole(roles) ? true : router.createUrlTree(['/403']);
};
