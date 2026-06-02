import { ErrorHandler, Injectable } from '@angular/core';
import { ToastService } from '@core/services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly toast: ToastService) {}

  handleError(error: unknown): void {
    console.error(error);
    this.toast.show({
      title: 'Application error',
      message: 'A recoverable application error occurred.',
      type: 'danger'
    });
  }
}
