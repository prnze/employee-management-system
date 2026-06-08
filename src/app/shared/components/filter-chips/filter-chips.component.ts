import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [TranslateModule, IconComponent],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterChipsComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly chips = input.required<{ key: string; label: string }[]>();
  readonly clearLabel = input<string>('COMMON_CLEAR_ALL');

  readonly remove = output<string>();
  readonly clearAll = output<void>();
}
