import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatxDownloadService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  download(filename: string, text: string): void {
    if (!this.browser) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    this.document.body.appendChild(link);
    link.click();
    link.remove();
    // Keep the URL alive through the browser's download dispatch.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
