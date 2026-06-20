import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@core/auth/auth-state.service';
import { TokenService } from '@core/auth/token.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authState = inject(AuthStateService);
  const tokens = inject(TokenService);
  const router = inject(Router);
  
  if (authState.isAuthenticated() && tokens.hasTokens()) {
    if (authState.user()?.forcePasswordReset && !state.url.includes('change-password')) {
      return router.createUrlTree(['/ems/auth/change-password']);
    }
    return true;
  }
  return router.createUrlTree(['/ems/auth/login'], { queryParams: { returnUrl: state.url } });
};
