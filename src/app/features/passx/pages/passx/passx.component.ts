import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@core/services/toast.service';
import { passxFadeUp } from '../../animations/passx.animations';
import { OPTION_ROWS, PASSX_MODES } from '../../constants/passx.constants';
import { AccentPickerComponent } from '../../components/accent-picker/accent-picker.component';
import { AmbientBackgroundComponent } from '../../components/ambient-background/ambient-background.component';
import { CommandPaletteComponent } from '../../components/command-palette/command-palette.component';
import { HistoryComponent } from '../../components/history/history.component';
import { OptionRowComponent } from '../../components/option-row/option-row.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { PassOptions, PassxMode } from '../../models/passx.models';
import { ClipboardService } from '../../services/clipboard.service';
import { EntropyService } from '../../services/entropy.service';
import { PasswordService } from '../../services/password.service';
import { PassxStore } from '../../store/passx.store';

@Component({
  selector: 'app-passx',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AccentPickerComponent,
    AmbientBackgroundComponent,
    CommandPaletteComponent,
    HistoryComponent,
    OptionRowComponent,
    StatsComponent,
    ThemeSwitcherComponent
  ],
  templateUrl: './passx.component.html',
  styleUrl: './passx.component.scss',
  animations: [passxFadeUp],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassxComponent {
  readonly store = inject(PassxStore);
  private readonly passwordService = inject(PasswordService);
  private readonly entropyService = inject(EntropyService);
  private readonly clipboard = inject(ClipboardService);
  private readonly toast = inject(ToastService);

  readonly password = signal('');
  readonly visible = signal(true);
  readonly copied = signal(false);
  readonly favoriteName = signal('');
  readonly showFavoriteForm = signal(false);
  readonly modes = PASSX_MODES;
  readonly optionRows = OPTION_ROWS;

  readonly poolSize = computed(() => this.passwordService.buildPool(this.store.options()).length || 26);
  readonly entropy = computed(() => this.entropyService.entropy(this.password(), this.poolSize()));
  readonly strength = computed(() => this.entropyService.strengthLabel(this.entropy()));
  readonly maskedPassword = computed(() => '•'.repeat(Math.min(this.password().length, 64)));

  constructor() {
    effect(() => {
      this.store.options();
      this.regenerate();
    });
  }

  regenerate(): void {
    this.password.set(this.passwordService.generatePassword(this.store.options()));
  }

  toggleVisibility(): void {
    this.visible.update((value) => !value);
  }

  toggleFavoriteForm(): void {
    this.showFavoriteForm.update((value) => !value);
  }

  updateOption(key: keyof PassOptions, value: boolean | number | PassxMode): void {
    this.store.setOptions({ [key]: value } as Partial<PassOptions>);
  }

  updateLength(value: string | number): void {
    const next = Math.max(4, Math.min(256, Number(value) || 4));
    this.store.setOptions({ length: next });
  }

  async copy(): Promise<void> {
    const password = this.password();
    if (!password) {
      return;
    }

    if (await this.clipboard.copy(password)) {
      this.copied.set(true);
      this.store.addHistory({ password, entropy: this.entropy() });
      this.toast.show(`Password copied (${password.length} chars - ${this.entropy()} bits)`, {
        classname: 'successtoast',
        delay: 2200
      });
      setTimeout(() => this.copied.set(false), 1400);
    }
  }

  saveFavorite(): void {
    this.store.addFavorite(this.favoriteName());
    this.favoriteName.set('');
    this.showFavoriteForm.set(false);
    this.toast.showToast('Saved', 'success');
  }

  restoreHistorySettings(id: string): void {
    const entry = this.store.history().find((item) => item.id === id);
    if (entry?.options) {
      this.store.setOptions(entry.options);
      this.toast.showToast('Settings restored', 'success');
    }
  }

  exportSettings(): void {
    const payload = JSON.stringify({ options: this.store.options(), favorites: this.store.favorites() }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'passx-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    this.toast.showToast('Settings exported', 'success');
  }
}
