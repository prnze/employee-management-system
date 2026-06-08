import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RuntimeConfigService } from '@core/services/runtime-config.service';

/**
 * Route-level feature flag guard.
 * Usage: add `data: { featureFlag: 'auditLogs' }` to a route,
 * then include `featureFlagGuard` in its `canActivate` array.
 */
export const featureFlagGuard: CanActivateFn = (route) => {
  const configService = inject(RuntimeConfigService);
  const router = inject(Router);
  const requiredFlag = route.data?.['featureFlag'] as string | undefined;

  if (!requiredFlag || configService.featureEnabled(requiredFlag)) {
    return true;
  }

  // Redirect to Forbidden page
  return router.createUrlTree(['/403']);
};
