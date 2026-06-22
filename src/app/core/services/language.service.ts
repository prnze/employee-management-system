import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

export interface Language {
  code: string;
  name: string;
  /** BCP-47 locale for date/number formatting. */
  locale: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', locale: 'en-GB', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', locale: 'de-DE', flag: '🇩🇪' }
];

const STORAGE_KEY = 'ems_language';
const DEFAULT_LANG = 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly storage = inject(LocalStorageService);

  /** Currently active language code — source of truth. */
  private readonly activeCode = signal<string>(this.resolveInitialLanguage());

  readonly languages = SUPPORTED_LANGUAGES;

  /** Currently active language code (read-only signal). */
  readonly currentCode = this.activeCode.asReadonly();

  /** Full Language object for the active language. */
  readonly currentLanguage = computed(() =>
    SUPPORTED_LANGUAGES.find((l) => l.code === this.activeCode()) ?? SUPPORTED_LANGUAGES[0]
  );

  constructor() {
    // Apply stored language on startup.
    this.translateService.use(this.activeCode());

    effect(() => {
      this.storage.set(STORAGE_KEY, this.activeCode(), localStorage);
    });
  }

  /** Switch the active language. Triggers transition animation externally. */
  setLanguage(code: string): void {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) return;
    if (this.activeCode() === code) return;
    this.activeCode.set(code);
    this.translateService.use(code);
  }

  private resolveInitialLanguage(): string {
    const stored = this.readStoredLanguage();
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored;

    return DEFAULT_LANG;
  }

  private readStoredLanguage(): string | null {
    try {
      return this.storage.get<string>(STORAGE_KEY, localStorage);
    } catch {
      return localStorage.getItem(STORAGE_KEY);
    }
  }
}
