import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-formatx-ambient-background',
  standalone: true,
  template: `
    <div class="ambient-bg" aria-hidden="true">
      <div class="blob blob-one"></div>
      <div class="blob blob-two"></div>
      <div class="blob blob-three"></div>
    </div>
  `,
  styleUrl: './ambient-background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmbientBackgroundComponent {}
