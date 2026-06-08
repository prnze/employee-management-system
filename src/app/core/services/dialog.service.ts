import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable
} from '@angular/core';
import { ConfirmationDialogComponent } from '@shared/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/components/dialog/dialog.models';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  confirm(data: ConfirmationDialogData): Promise<boolean> {
    return new Promise((resolve) => {
      // Create ComponentRef
      const componentRef = createComponent(ConfirmationDialogComponent, {
        environmentInjector: this.injector
      });

      // Pass inputs/data to the component
      componentRef.setInput('data', data);

      // Listen to confirm/cancel outputs
      const subConfirm = componentRef.instance.confirm.subscribe(() => {
        resolve(true);
        cleanup();
      });
      const subCancel = componentRef.instance.cancel.subscribe(() => {
        resolve(false);
        cleanup();
      });

      const cleanup = () => {
        subConfirm.unsubscribe();
        subCancel.unsubscribe();
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      };

      // Attach component view to ApplicationRef so change detection works
      this.appRef.attachView(componentRef.hostView);

      // Append DOM element to body
      const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    });
  }

  alert(data: Omit<ConfirmationDialogData, 'cancelText'>): Promise<void> {
    return this.confirm({
      ...data,
      cancelText: '' // indicates no cancel button
    }).then(() => {});
  }

  success(data: Omit<ConfirmationDialogData, 'cancelText' | 'variant'>): Promise<void> {
    return this.confirm({
      ...data,
      variant: 'success',
      cancelText: ''
    }).then(() => {});
  }

  error(data: Omit<ConfirmationDialogData, 'cancelText' | 'variant'>): Promise<void> {
    return this.confirm({
      ...data,
      variant: 'danger',
      cancelText: ''
    }).then(() => {});
  }

  warning(data: Omit<ConfirmationDialogData, 'cancelText' | 'variant'>): Promise<void> {
    return this.confirm({
      ...data,
      variant: 'warning',
      cancelText: ''
    }).then(() => {});
  }
}
