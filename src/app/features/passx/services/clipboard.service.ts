import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  async copy(text: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId) || !text) {
      return false;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const element = this.document.createElement('textarea');
    element.value = text;
    element.style.position = 'fixed';
    element.style.opacity = '0';
    this.document.body.appendChild(element);
    element.select();
    const copied = this.document.execCommand('copy');
    element.remove();
    return copied;
  }
}
