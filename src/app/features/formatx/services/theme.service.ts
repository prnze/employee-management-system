import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { FormatxTheme } from '../models/formatx.models';

@Injectable({ providedIn: 'root' })
export class FormatxThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  apply(theme: FormatxTheme, accent: string): void {
    if (!this.browser) return;
    const el = this.document.documentElement;
    el.classList.remove('dark', 'pitch');
    if (theme === 'dark') el.classList.add('dark');
    if (theme === 'pitch') el.classList.add('pitch');
    el.style.setProperty('--accent-color', accent);
    el.style.setProperty('--accent-foreground', theme === 'light' ? 'oklch(0.99 0 0)' : 'oklch(0.1 0 0)');
  }
}
