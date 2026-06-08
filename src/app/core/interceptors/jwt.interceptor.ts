import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@core/auth/token.service';
import { RuntimeConfigService } from '@core/services/runtime-config.service';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(TokenService).accessToken();
  const configService = inject(RuntimeConfigService);
  const isApiRequest = request.url.startsWith(configService.apiUrl()) || request.url.startsWith('/api');
  
  if (!token || !isApiRequest) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
