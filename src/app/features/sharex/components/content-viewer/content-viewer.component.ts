import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentType } from '../../models/share.model';

@Component({
  selector: 'app-content-viewer',
  standalone: true,
  template: `
    <div class="sx-content-display" [class]="'sx-content--' + contentType()">
      <pre class="sx-content-pre"><code>{{ content() }}</code></pre>
    </div>
  `,
  styles: `
    .sx-content-display {
      border-radius: var(--sx-radius-md, 16px);
      overflow: hidden;
    }

    .sx-content-pre {
      margin: 0;
      padding: 20px 24px;
      background: color-mix(in srgb, var(--sx-bg-secondary, #0B0B0B) 88%, transparent);
      border: 1px solid var(--sx-border, rgba(255, 255, 255, 0.07));
      border-radius: var(--sx-radius-md, 16px);
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.15) transparent;

      &::-webkit-scrollbar {
        height: 5px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 999px;
      }

      code {
        font-family: var(--sx-font-mono, 'JetBrains Mono', monospace);
        font-size: 0.85rem;
        line-height: 1.7;
        color: var(--sx-text, rgba(255, 255, 255, 0.93));
        white-space: pre-wrap;
        word-break: break-word;
        tab-size: 2;
      }
    }

    .sx-content--code .sx-content-pre code,
    .sx-content--json .sx-content-pre code {
      white-space: pre;
      word-break: normal;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentViewerComponent {
  readonly content = input.required<string>();
  readonly contentType = input<ContentType>('text');
  readonly language = input<string | null>(null);
}
