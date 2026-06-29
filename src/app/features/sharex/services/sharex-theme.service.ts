import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type SharexTheme = 'dark' | 'light';

export interface SharexAccent {
  readonly name: string;
  readonly value: string;
  readonly hover: string;
  readonly soft: string;
  readonly border: string;
}

const THEME_KEY = 'sharex_theme_v2';
const ACCENT_KEY = 'sharex_accent_v2';

export const SHAREX_ACCENTS: SharexAccent[] = [
  { name: 'Blue', value: '#0A84FF', hover: '#0071E3', soft: 'rgba(10,132,255,0.14)', border: 'rgba(10,132,255,0.28)' },
  { name: 'Purple', value: '#BF5AF2', hover: '#A64DE0', soft: 'rgba(191,90,242,0.14)', border: 'rgba(191,90,242,0.28)' },
  { name: 'Green', value: '#30D158', hover: '#27B64C', soft: 'rgba(48,209,88,0.14)', border: 'rgba(48,209,88,0.28)' },
  { name: 'Orange', value: '#FF9F0A', hover: '#E88E00', soft: 'rgba(255,159,10,0.14)', border: 'rgba(255,159,10,0.28)' },
  { name: 'Red', value: '#FF453A', hover: '#E6342A', soft: 'rgba(255,69,58,0.14)', border: 'rgba(255,69,58,0.28)' },
  { name: 'Pink', value: '#FF375F', hover: '#E82E54', soft: 'rgba(255,55,95,0.14)', border: 'rgba(255,55,95,0.28)' },
  { name: 'Indigo', value: '#5E5CE6', hover: '#4D4BD1', soft: 'rgba(94,92,230,0.14)', border: 'rgba(94,92,230,0.28)' },
  { name: 'Teal', value: '#40C8E0', hover: '#25AEC7', soft: 'rgba(64,200,224,0.14)', border: 'rgba(64,200,224,0.28)' },
  { name: 'Yellow', value: '#FFD60A', hover: '#E7BE00', soft: 'rgba(255,214,10,0.16)', border: 'rgba(255,214,10,0.30)' },
  { name: 'Graphite', value: '#8E8E93', hover: '#6E6E73', soft: 'rgba(142,142,147,0.16)', border: 'rgba(142,142,147,0.30)' }
];

@Injectable({ providedIn: 'root' })
export class SharexThemeService {
  private readonly document = inject(DOCUMENT);

  readonly accents = SHAREX_ACCENTS;
  readonly theme = signal<SharexTheme>(this.readTheme());
  readonly accentName = signal(this.readAccentName());
  readonly accent = computed(() => this.accents.find((item) => item.name === this.accentName()) ?? this.accents[0]);

  constructor() {
    effect(() => {
      const theme = this.theme();
      const accent = this.accent();
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(ACCENT_KEY, accent.name);
      this.applyToDocument(theme, accent);
    });
  }

  setTheme(theme: SharexTheme): void {
    this.theme.set(theme);
  }

  setAccent(name: string): void {
    if (this.accents.some((accent) => accent.name === name)) {
      this.accentName.set(name);
    }
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private readTheme(): SharexTheme {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return 'dark';
  }

  private readAccentName(): string {
    const stored = localStorage.getItem(ACCENT_KEY);
    return this.accents.some((accent) => accent.name === stored) ? stored! : 'Blue';
  }

  private applyToDocument(theme: SharexTheme, accent: SharexAccent): void {
    const root = this.document.documentElement;
    root.style.setProperty('--sharex-accent', accent.value);
    root.style.setProperty('--sharex-accent-hover', accent.hover);
    root.style.setProperty('--sharex-accent-soft', accent.soft);
    root.style.setProperty('--sharex-accent-border', accent.border);
    root.dataset['sharexTheme'] = theme;
  }
}
