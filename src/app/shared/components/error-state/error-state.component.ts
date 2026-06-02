import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `<section class="alert alert-danger" role="alert"><strong>{{ title() }}</strong><p class="mb-0">{{ message() }}</p></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  readonly title = input('Error');
  readonly message = input('Something went wrong.');
}
