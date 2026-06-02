import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@core/auth/auth-state.service';
import { TokenService } from '@core/auth/token.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authState = inject(AuthStateService);
  const tokens = inject(TokenService);
  const router = inject(Router);
  return authState.isAuthenticated() && tokens.hasTokens()
    ? true
    : router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
