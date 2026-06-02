import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { StorageService } from './storage.service';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  private readonly themeSignal = signal<AppTheme>('light');
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      this.document.documentElement.setAttribute('data-bs-theme', theme);
      this.storage.set(STORAGE_KEYS.theme, theme, localStorage);
    });
  }

  initialize(): void {
    this.themeSignal.set(this.storage.get<AppTheme>(STORAGE_KEYS.theme, localStorage) ?? 'light');
  }

  toggle(): void {
    this.themeSignal.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}
