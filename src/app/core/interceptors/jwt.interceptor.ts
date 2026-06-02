import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@core/auth/token.service';
import { environment } from '@env/environment';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(TokenService).accessToken();
  const isApiRequest = request.url.startsWith(environment.apiBaseUrl) || request.url.startsWith('/api');
  if (!token || !isApiRequest) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
