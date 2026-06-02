import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<section class="surface text-center p-5"><h2 class="fs-5">{{ title() }}</h2><p class="text-body-secondary mb-0">{{ message() }}</p></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  readonly title = input('No data');
  readonly message = input('There is nothing to show yet.');
}
