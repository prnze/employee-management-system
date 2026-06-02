import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { TokenService } from '@core/auth/token.service';
import { REFRESH_ATTEMPTED } from '@core/constants/http-context.tokens';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';

let refreshRequest$: Observable<{ accessToken: string; expiresAt: string }> | null = null;

export const refreshTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const tokens = inject(TokenService);
  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && tokens.refreshToken() && !request.context.get(REFRESH_ATTEMPTED)) {
        refreshRequest$ ??= auth.refreshToken().pipe(
          finalize(() => {
            refreshRequest$ = null;
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
        return refreshRequest$.pipe(
          switchMap(({ accessToken, expiresAt }) => {
            tokens.updateAccessToken(accessToken, expiresAt);
            return next(
              request.clone({
                context: request.context.set(REFRESH_ATTEMPTED, true),
                setHeaders: { Authorization: `Bearer ${accessToken}` }
              })
            );
          })
        );
      }
      return throwError(() => error);
    })
  );
};
