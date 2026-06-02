import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    <div aria-hidden="true">
      @for (row of rowsArray(); track row) {
        <p class="placeholder-glow mb-2"><span class="placeholder col-12 rounded"></span></p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  readonly rows = input(3);
  rowsArray(): number[] {
    return Array.from({ length: this.rows() }, (_, index) => index);
  }
}
