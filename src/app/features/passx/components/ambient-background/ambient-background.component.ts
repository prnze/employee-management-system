import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-passx-ambient-background',
  standalone: true,
  templateUrl: './ambient-background.component.html',
  styleUrl: './ambient-background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmbientBackgroundComponent {}
