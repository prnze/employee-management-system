import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatxClipboardService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  async copy(text: string): Promise<boolean> {
    if (!this.browser) return false;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const area = this.document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    this.document.body.appendChild(area);
    area.select();
    const copied = this.document.execCommand('copy');
    area.remove();
    return copied;
  }

  async paste(): Promise<string> {
    if (!this.browser || !navigator.clipboard?.readText) return '';
    return navigator.clipboard.readText();
  }
}
