import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { TOOL_DEFINITIONS, ToolNavigationItem } from '@core/models/tool-navigation.models';

@Injectable({ providedIn: 'root' })
export class ToolNavigationService {
  private readonly document = inject(DOCUMENT);

  /**
   * Links tool destinations to the local multi-app host during development and
   * to prnze.in everywhere else. Each item has its own branded SVG fallback.
   */
  get tools(): readonly ToolNavigationItem[] {
    const baseUrl = this.isLocalhost() ? 'http://localhost:4200' : 'https://prnze.in';

    return TOOL_DEFINITIONS.map((tool) => ({
      id: tool.id,
      labelKey: tool.labelKey,
      href: `${baseUrl}${tool.path}`,
      faviconUrl: `${baseUrl}${tool.faviconPath}`
    }));
  }

  private isLocalhost(): boolean {
    const hostname = this.document.defaultView?.location.hostname ?? '';
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }
}
