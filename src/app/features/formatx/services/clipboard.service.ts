import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatxClipboardService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  async copy(text: string): Promise<boolean> {
    if (!this.browser) return false;
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Permission denial falls through to the selection-based fallback.
      }
    }
    const area = this.document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    this.document.body.appendChild(area);
    area.select();
    try {
      return this.document.execCommand('copy');
    } finally {
      area.remove();
    }
  }

  async paste(): Promise<string> {
    if (!this.browser || !navigator.clipboard?.readText) return '';
    return navigator.clipboard.readText();
  }
}
