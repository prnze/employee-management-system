import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ACCENTS, DEFAULT_PASS_OPTIONS, PASSX_STORAGE_KEY } from '../constants/passx.constants';
import { AccentKey, FavoritePreset, HistoryEntry, PassOptions, PassxState, PassxTheme } from '../models/passx.models';
import { AccentService } from '../services/accent.service';
import { HistoryService } from '../services/history.service';
import { PassxStorageService } from '../services/storage.service';
import { PassxThemeService } from '../services/theme.service';

@Injectable({ providedIn: 'root' })
export class PassxStore {
  private readonly storage = inject(PassxStorageService);
  private readonly historyService = inject(HistoryService);
  private readonly accentService = inject(AccentService);
  private readonly themeService = inject(PassxThemeService);
  private readonly state = signal<PassxState>(this.restoreState());

  readonly theme = computed(() => this.state().theme);
  readonly accent = computed(() => this.state().accent);
  readonly customAccent = computed(() => this.state().customAccent);
  readonly options = computed(() => this.state().options);
  readonly history = computed(() => this.state().history);
  readonly favorites = computed(() => this.state().favorites);
  readonly accentColor = computed(() => this.accentService.resolveAccentColor(this.accent(), this.customAccent()));

  constructor() {
    effect(() => {
      const current = this.state();
      this.storage.write(PASSX_STORAGE_KEY, current);
      this.themeService.apply(current.theme, this.accentColor());
    });
  }

  setTheme(theme: PassxTheme): void {
    this.patch({ theme });
  }

  setAccent(accent: AccentKey): void {
    this.patch({ accent });
  }

  setCustomAccent(customAccent: string): void {
    this.patch({ customAccent, accent: 'custom' });
  }

  setOptions(options: Partial<PassOptions>): void {
    this.state.update((state) => ({ ...state, options: { ...state.options, ...options } }));
  }

  addHistory(entry: Omit<HistoryEntry, 'id' | 'at'> & Partial<Pick<HistoryEntry, 'id' | 'at' | 'options'>>): void {
    const fullEntry: HistoryEntry = {
      id: entry.id ?? crypto.randomUUID(),
      at: entry.at ?? Date.now(),
      password: entry.password,
      entropy: entry.entropy,
      options: entry.options ?? this.options()
    };
    this.state.update((state) => ({ ...state, history: this.historyService.add(state.history, fullEntry) }));
  }

  deleteHistory(id: string): void {
    this.state.update((state) => ({ ...state, history: this.historyService.delete(state.history, id) }));
  }

  clearHistory(): void {
    this.patch({ history: [] });
  }

  addFavorite(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    const favorite: FavoritePreset = { id: crypto.randomUUID(), name: trimmed, options: this.options() };
    this.state.update((state) => ({ ...state, favorites: [...state.favorites, favorite] }));
  }

  removeFavorite(id: string): void {
    this.state.update((state) => ({ ...state, favorites: state.favorites.filter((favorite) => favorite.id !== id) }));
  }

  applyFavorite(id: string): void {
    const favorite = this.favorites().find((item) => item.id === id);
    if (favorite) {
      this.setOptions(favorite.options);
    }
  }

  private patch(value: Partial<PassxState>): void {
    this.state.update((state) => ({ ...state, ...value }));
  }

  private restoreState(): PassxState {
    const persisted = this.storage.read<Partial<PassxState>>(PASSX_STORAGE_KEY);
    return {
      theme: persisted?.theme ?? 'dark',
      accent: persisted?.accent ?? 'blue',
      customAccent: persisted?.customAccent ?? ACCENTS.custom,
      options: { ...DEFAULT_PASS_OPTIONS, ...persisted?.options },
      history: persisted?.history ?? [],
      favorites: persisted?.favorites ?? []
    };
  }
}
