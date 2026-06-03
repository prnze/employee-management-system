import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `<footer class="border-top bg-body px-3 py-2 small text-body-secondary">{{ 'FOOTER_TEXT' | translate }}</footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
