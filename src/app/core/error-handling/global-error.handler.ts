import { ErrorHandler, Injectable } from '@angular/core';
import { ToastService } from '@core/services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly toast: ToastService) {}

  handleError(error: unknown): void {
    console.error(error);
    this.toast.showToast('APP_ERROR_RECOVERABLE', 'error');
  }
}
