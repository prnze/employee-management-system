import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `<div class="d-inline-flex align-items-center gap-2" role="status" [attr.aria-label]="label()"><span class="spinner-border spinner-border-sm"></span><span>{{ label() }}</span></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  readonly label = input('Loading');
}
