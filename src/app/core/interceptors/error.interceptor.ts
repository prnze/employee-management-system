import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 403) {
          void router.navigateByUrl('/403');
        }
        if (error.status >= 500) {
          void router.navigateByUrl('/500');
        }
        toast.show({ title: 'Request failed', message: error.message, type: 'danger' });
      }
      return throwError(() => error);
    })
  );
};
