import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog">
          <section class="modal-content">
            <header class="modal-header">
              <h2 class="modal-title fs-5">{{ title() }}</h2>
              <button type="button" class="btn-close" aria-label="Close" (click)="closed.emit()"></button>
            </header>
            <div class="modal-body"><ng-content /></div>
          </section>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('Dialog');
  readonly closed = output<void>();
}
