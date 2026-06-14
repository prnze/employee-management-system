import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

/**
 * Reusable chart card wrapper.
 * Provides a consistent surface with title, optional badge, and slot for chart content.
 * Handles loading skeleton and error states via inputs.
 *
 * Usage:
 * ```html
 * <app-chart-card title="Employee Growth" badge="12 months" [loading]="loading()">
 *   <app-line-chart ... />
 * </app-chart-card>
 * ```
 */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [IconComponent, TranslatePipe],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly title         = input.required<string>();
  readonly badge         = input<string>('');
  readonly badgeClass    = input<string>('text-bg-primary');
  readonly loading       = input<boolean>(false);
  readonly error         = input<string>('');
  readonly skeletonHeight = input<string>('180px');
}
