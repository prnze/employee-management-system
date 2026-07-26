import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TOOL_DEFINITIONS } from '@core/models/tool-navigation.models';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ToolFaviconService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  initialize(): void {
    this.updateFavicon(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateFavicon(event.urlAfterRedirects));
  }

  private updateFavicon(url: string): void {
    const pathname = url.split(/[?#]/, 1)[0];
    const tool = TOOL_DEFINITIONS.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`));
    const faviconPath = tool?.faviconPath ?? '/favicon.svg';
    const favicon = this.document.querySelector<HTMLLinkElement>('link[rel~="icon"]');

    if (favicon) {
      favicon.href = faviconPath;
      favicon.type = 'image/svg+xml';
    }
  }
}
