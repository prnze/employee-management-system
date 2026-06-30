import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatxStorageService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  read<T>(key: string): T | null {
    if (!this.browser) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    if (this.browser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
