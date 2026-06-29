import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ShareFile, formatFileSize, getFileIcon } from '../../models/share.model';
import { SharexStorageService } from '../../services/sharex-storage.service';
import { FilePreviewService } from '../../services/file-preview.service';
import { SharexService } from '../../services/sharex.service';
import { FilePreviewModalComponent } from '../file-preview-modal/file-preview-modal.component';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [FilePreviewModalComponent],
  template: `
    <div class="sx-file-list">
      @for (file of files(); track file.id) {
        <div class="sx-file-item">
          <div class="sx-file-item-icon">
            <span class="material-symbols-rounded">{{ getIcon(file.mime_type) }}</span>
          </div>
          <div class="sx-file-item-info">
            <span class="sx-file-item-name">{{ file.file_name }}</span>
            <span class="sx-file-item-size">{{ formatSize(file.size) }}</span>
          </div>
          <div class="sx-file-item-actions">
            @if (isPreviewable(file)) {
              <button
                type="button"
                class="sx-file-item-btn sx-file-item-preview"
                (click)="openPreview(file)"
                title="Preview">
                <span class="material-symbols-rounded">visibility</span>
              </button>
            }
            <a
              [href]="getUrl(file)"
              target="_blank"
              rel="noopener noreferrer"
              class="sx-file-item-btn sx-file-item-download"
              (click)="trackDownload(file)"
              download
              title="Download">
              <span class="material-symbols-rounded">download</span>
            </a>
          </div>
        </div>
      }
    </div>

    @if (previewFile()) {
      <app-file-preview-modal
        [file]="previewFile()!"
        [expiryAt]="expiryAt()"
        (closed)="closePreview()" />
    }
  `,
  styles: `
    .sx-file-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sx-file-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: var(--sx-card, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--sx-border, rgba(255, 255, 255, 0.07));
      border-radius: var(--sx-radius-md, 16px);
      transition: transform var(--sx-duration-3, 200ms) var(--sx-ease, cubic-bezier(.22,1,.36,1)), background var(--sx-duration-2, 150ms) ease, border-color var(--sx-duration-2, 150ms) ease;

      &:hover {
        background: var(--sx-card-strong, rgba(255, 255, 255, 0.075));
        border-color: var(--sx-border-hover, rgba(255, 255, 255, 0.12));
        transform: translateY(-1px);
      }
    }

    .sx-file-item-icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: var(--sx-radius-sm, 12px);
      background: var(--sx-accent-soft, rgba(10,132,255,0.14));
      color: var(--sx-accent, #0A84FF);
      flex-shrink: 0;

      .material-symbols-rounded { font-size: 1.25rem; }
    }

    .sx-file-item-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .sx-file-item-name {
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--sx-text, rgba(255, 255, 255, 0.93));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sx-file-item-size {
      font-size: 0.75rem;
      color: var(--sx-text-muted, rgba(255, 255, 255, 0.32));
      font-family: var(--sx-font-mono, monospace);
    }

    .sx-file-item-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .sx-file-item-btn {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: var(--sx-radius-sm, 12px);
      background: transparent;
      border: 1px solid var(--sx-border, rgba(255, 255, 255, 0.07));
      color: var(--sx-text-secondary, rgba(255, 255, 255, 0.55));
      text-decoration: none;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.25s ease;

      .material-symbols-rounded { font-size: 1.1rem; }
    }

    .sx-file-item-preview:hover {
      background: color-mix(in srgb, var(--sx-info, #40C8E0) 12%, transparent);
      border-color: color-mix(in srgb, var(--sx-info, #40C8E0) 28%, transparent);
      color: var(--sx-info, #40C8E0);
      transform: translateY(-1px);
    }

    .sx-file-item-download:hover {
      background: var(--sx-accent-soft, rgba(10,132,255,0.14));
      border-color: var(--sx-accent-border, rgba(10,132,255,0.28));
      color: var(--sx-accent, #0A84FF);
      transform: translateY(-1px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent {
  private readonly storage = inject(SharexStorageService);
  private readonly previewService = inject(FilePreviewService);
  private readonly sharexService = inject(SharexService);

  readonly files = input.required<ShareFile[]>();
  readonly expiryAt = input<string | null>(null);
  readonly previewFile = signal<ShareFile | null>(null);

  getUrl(file: ShareFile): string {
    return this.storage.getPublicUrl(file.storage_path);
  }

  formatSize(bytes: number): string {
    return formatFileSize(bytes);
  }

  getIcon(mimeType: string): string {
    return getFileIcon(mimeType);
  }

  isPreviewable(file: ShareFile): boolean {
    return this.previewService.isPreviewable(file.mime_type, file.file_name);
  }

  openPreview(file: ShareFile): void {
    this.previewFile.set(file);
  }

  closePreview(): void {
    this.previewFile.set(null);
  }

  trackDownload(file: ShareFile): void {
    void this.sharexService.recordDownload(file.share_id);
  }
}
