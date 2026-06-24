import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  siteName?: string;
  author?: string;
  robots?: string;
  keywords?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://prnze.in';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /**
   * Returns the full canonical URL for a given path.
   * Ensures consistent formatting: no double slashes, trailing slash on root.
   */
  static canonicalUrl(path: string): string {
    const clean = path.replace(/^\/+/, '');
    return clean ? `${BASE_URL}/${clean}` : `${BASE_URL}/`;
  }

  /**
   * One-call method to set all SEO metadata for a route.
   */
  update(config: SeoConfig): void {
    const {
      title,
      description,
      url,
      image = `${BASE_URL}/assets/profile.jpg`,
      type = 'website',
      siteName = 'Prince L J',
      author = 'Prince L J',
      robots = 'index, follow, max-image-preview:large',
      keywords,
      jsonLd
    } = config;

    // Title
    this.title.setTitle(title);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: author });
    this.meta.updateTag({ name: 'robots', content: robots });

    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical link
    this.setCanonical(url);

    // JSON-LD structured data
    if (jsonLd) {
      this.setJsonLd(jsonLd);
    }
  }

  /**
   * Creates or updates the <link rel="canonical"> element.
   */
  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  /**
   * Creates or replaces the JSON-LD <script> block.
   */
  private setJsonLd(data: Record<string, unknown>): void {
    const id = 'seo-json-ld';
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
