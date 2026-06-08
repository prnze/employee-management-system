import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastMessage, ToastService } from '@core/services/toast.service';

@Component({
  selector: 'lib-toast',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, TranslatePipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 10000'
  },
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '250ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate(
          '250ms ease-in',
          style({ transform: 'translateX(100%)', opacity: 0 })
        )
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  isTemplate(toast: ToastMessage): toast is ToastMessage & { textOrTpl: TemplateRef<unknown> } {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
