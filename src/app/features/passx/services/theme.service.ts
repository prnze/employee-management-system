import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { PassxTheme } from '../models/passx.models';

@Injectable({ providedIn: 'root' })
export class PassxThemeService {
  private readonly document = inject(DOCUMENT);

  apply(theme: PassxTheme, accentColor: string): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('black', theme === 'black');
    root.style.setProperty('--accent-color', accentColor);
  }
}
