import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PassxStore } from '../../store/passx.store';
import { PassxTheme } from '../../models/passx.models';

@Component({
  selector: 'app-passx-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSwitcherComponent {
  readonly store = inject(PassxStore);
  readonly themes: { key: PassxTheme; icon: string; label: string }[] = [
    { key: 'light', icon: 'light_mode', label: 'Light' },
    { key: 'dark', icon: 'dark_mode', label: 'Graphite' },
    { key: 'black', icon: 'circle', label: 'OLED' }
  ];
}
