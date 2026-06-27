import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output, signal, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ShareFile, formatFileSize } from '../../models/share.model';
import { FilePreviewService, PreviewData } from '../../services/file-preview.service';
import { SharexStorageService } from '../../services/sharex-storage.service';
import { ExpiryCountdownService } from '../../services/expiry-countdown.service';
import { SharexService } from '../../services/sharex.service';

@Component({
  selector: 'app-file-preview-modal',
  standalone: true,
  template: `
    <div class="sx-preview-backdrop" (click)="onBackdropClick($event)">
      <div class="sx-preview-modal" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="sx-preview-header">
          <div class="sx-preview-file-info">
            <span class="sx-preview-filename">{{ file().file_name }}</span>
            <span class="sx-preview-meta">
              {{ formatFileSize(file().size) }}
              @if (countdownDisplay()) {
                <span class="sx-preview-meta-divider">/</span>
                Expires in {{ countdownDisplay() }}
              }
            </span>
          </div>
          <div class="sx-preview-actions">
            <a
              [href]="downloadUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="sx-preview-btn"
              (click)="trackDownload()"
              download
              title="Download">
              <span class="material-symbols-rounded">download</span>
            </a>
            <button
              type="button"
              class="sx-preview-btn sx-preview-btn--close"
              (click)="close()"
              title="Close (Esc)">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="sx-preview-content">
          @if (isLoading()) {
            <div class="sx-preview-loading">
              <div class="sx-preview-spinner"></div>
              <p>Loading preview...</p>
            </div>
          } @else if (preview()) {
            @switch (preview()!.type) {
              @case ('image') {
                <div class="sx-preview-image-wrap">
                  <img
                    [src]="preview()!.url"
                    [alt]="preview()!.fileName"
                    class="sx-preview-image"
                    loading="eager" />
                </div>
              }
              @case ('pdf') {
                <iframe
                  [src]="safePreviewUrl()"
                  class="sx-preview-pdf"
                  title="PDF Preview"
                  frameborder="0">
                </iframe>
              }
              @case ('video') {
                <div class="sx-preview-media-wrap">
                  <video
                    [src]="preview()!.url"
                    class="sx-preview-video"
                    controls
                    controlslist="nodownload"
                    preload="metadata">
                    Your browser does not support video playback.
                  </video>
                </div>
              }
              @case ('audio') {
                <div class="sx-preview-audio-wrap">
                  <div class="sx-preview-audio-icon">
                    <span class="material-symbols-rounded">music_note</span>
                  </div>
                  <p class="sx-preview-audio-name">{{ preview()!.fileName }}</p>
                  <audio
                    [src]="preview()!.url"
                    class="sx-preview-audio"
                    controls
                    preload="metadata">
                    Your browser does not support audio playback.
                  </audio>
                </div>
              }
              @case ('text') {
                <div class="sx-preview-text-wrap">
                  @if (detectedLanguage) {
                    <span class="sx-preview-lang-badge">{{ detectedLanguage }}</span>
                  }
                  <pre class="sx-preview-text"><code>{{ preview()!.textContent }}</code></pre>
                </div>
              }
              @default {
                <div class="sx-preview-unsupported">
                  <span class="material-symbols-rounded">insert_drive_file</span>
                  <p>Preview not available for this file type.</p>
                  <a
                    [href]="downloadUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="sx-preview-download-btn"
                    (click)="trackDownload()"
                    download>
                    <span class="material-symbols-rounded">download</span>
                    Download File
                  </a>
                </div>
              }
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    /* ── Backdrop ───────────────────────────────────────────────── */
    .sx-preview-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      animation: preview-backdrop-in 0.3s ease both;
    }

    @keyframes preview-backdrop-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Modal ──────────────────────────────────────────────────── */
    .sx-preview-modal {
      width: 100%;
      max-width: 960px;
      max-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      border-radius: var(--sx-radius-2xl, 28px);
      background: rgba(12, 12, 20, 0.8);
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 0 0.5px rgba(255, 255, 255, 0.04);
      overflow: hidden;
      animation: preview-modal-in 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    @keyframes preview-modal-in {
      from { opacity: 0; transform: scale(0.95) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ── Header ─────────────────────────────────────────────────── */
    .sx-preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      flex-shrink: 0;
    }

    .sx-preview-file-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .sx-preview-filename {
      font-size: 0.9rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.93);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sx-preview-meta {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.35);
      font-family: var(--sx-font-mono, monospace);
    }

    .sx-preview-meta-divider {
      padding: 0 6px;
      opacity: 0.45;
    }

    .sx-preview-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .sx-preview-btn {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.07);
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.25s ease;

      .material-symbols-rounded { font-size: 1.15rem; }

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }

      &--close:hover {
        background: rgba(239, 68, 68, 0.12);
        border-color: rgba(239, 68, 68, 0.25);
        color: #f87171;
      }
    }

    /* ── Content Area ───────────────────────────────────────────── */
    .sx-preview-content {
      flex: 1;
      overflow: auto;
      min-height: 200px;
      max-height: calc(100vh - 140px);
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.12) transparent;

      &::-webkit-scrollbar { width: 5px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
        border-radius: 999px;
      }
    }

    /* ── Loading ─────────────────────────────────────────────────── */
    .sx-preview-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 80px 24px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.88rem;

      p { margin: 0; }
    }

    .sx-preview-spinner {
      width: 32px;
      height: 32px;
      border: 2.5px solid rgba(255, 255, 255, 0.1);
      border-top-color: #a78bfa;
      border-radius: 50%;
      animation: preview-spin 0.8s linear infinite;
    }

    @keyframes preview-spin {
      to { transform: rotate(360deg); }
    }

    /* ── Image ──────────────────────────────────────────────────── */
    .sx-preview-image-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      min-height: 300px;
    }

    .sx-preview-image {
      max-width: 100%;
      max-height: calc(100vh - 200px);
      border-radius: 12px;
      object-fit: contain;
      animation: preview-fade-in 0.4s ease both;
    }

    @keyframes preview-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── PDF ─────────────────────────────────────────────────────── */
    .sx-preview-pdf {
      width: 100%;
      height: calc(100vh - 160px);
      min-height: 500px;
      border: none;
      background: #1a1a2e;
    }

    /* ── Video ──────────────────────────────────────────────────── */
    .sx-preview-media-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .sx-preview-video {
      max-width: 100%;
      max-height: calc(100vh - 200px);
      border-radius: 12px;
      background: #000;
    }

    /* ── Audio ──────────────────────────────────────────────────── */
    .sx-preview-audio-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 60px 24px;
    }

    .sx-preview-audio-icon {
      width: 80px;
      height: 80px;
      display: grid;
      place-items: center;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.15));
      border: 1px solid rgba(139, 92, 246, 0.15);

      .material-symbols-rounded {
        font-size: 2.5rem;
        color: #a78bfa;
      }
    }

    .sx-preview-audio-name {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
    }

    .sx-preview-audio {
      width: min(100%, 420px);
      height: 48px;
      border-radius: 24px;
      filter: invert(1) hue-rotate(180deg) brightness(0.85);
    }

    /* ── Text ───────────────────────────────────────────────────── */
    .sx-preview-text-wrap {
      position: relative;
      padding: 4px;
    }

    .sx-preview-lang-badge {
      position: absolute;
      top: 12px;
      right: 16px;
      padding: 3px 10px;
      border-radius: 8px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      font-size: 0.7rem;
      font-weight: 600;
      font-family: var(--sx-font-mono, monospace);
      text-transform: lowercase;
      z-index: 1;
    }

    .sx-preview-text {
      margin: 0;
      padding: 24px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 0 0 var(--sx-radius-2xl, 28px) var(--sx-radius-2xl, 28px);
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.12) transparent;

      &::-webkit-scrollbar { height: 5px; width: 5px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
        border-radius: 999px;
      }

      code {
        font-family: var(--sx-font-mono, 'JetBrains Mono', monospace);
        font-size: 0.82rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.88);
        white-space: pre;
        tab-size: 2;
      }
    }

    /* ── Unsupported ────────────────────────────────────────────── */
    .sx-preview-unsupported {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 80px 24px;
      color: rgba(255, 255, 255, 0.4);

      .material-symbols-rounded {
        font-size: 3rem;
        opacity: 0.4;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
      }
    }

    .sx-preview-download-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 14px;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-family: var(--sx-font, 'Inter', sans-serif);
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;

      .material-symbols-rounded { font-size: 1.1rem; }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
      }
    }

    /* ── Responsive ─────────────────────────────────────────────── */
    @media (max-width: 640px) {
      .sx-preview-backdrop { padding: 8px; }

      .sx-preview-modal {
        border-radius: 20px;
        max-height: calc(100vh - 16px);
      }

      .sx-preview-header { padding: 12px 16px; }
      .sx-preview-filename { font-size: 0.82rem; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePreviewModalComponent implements OnInit, OnDestroy {
  private readonly previewService = inject(FilePreviewService);
  private readonly storage = inject(SharexStorageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly countdown = inject(ExpiryCountdownService);
  private readonly sharexService = inject(SharexService);

  readonly file = input.required<ShareFile>();
  readonly expiryAt = input<string | null>(null);
  readonly closed = output<void>();

  readonly preview = signal<PreviewData | null>(null);
  readonly isLoading = signal(true);
  readonly countdownDisplay = signal<string | null>(null);
  readonly safePreviewUrl = signal<SafeResourceUrl | null>(null);

  readonly formatFileSize = formatFileSize;

  detectedLanguage: string | null = null;
  downloadUrl = '';
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  async ngOnInit(): Promise<void> {
    const f = this.file();
    this.downloadUrl = this.storage.getPublicUrl(f.storage_path);
    this.detectedLanguage = this.previewService.detectLanguage(f.file_name);
    this.startCountdown();

    try {
      const data = await this.previewService.loadPreview(f);
      this.safePreviewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(data.url));
      this.preview.set(data);
    } catch {
      this.safePreviewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.downloadUrl));
      this.preview.set({
        type: 'unsupported',
        url: this.downloadUrl,
        mimeType: f.mime_type,
        fileName: f.file_name
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('sx-preview-backdrop')) {
      this.close();
    }
  }

  trackDownload(): void {
    void this.sharexService.recordDownload(this.file().share_id);
  }

  private startCountdown(): void {
    const expiryAt = this.expiryAt();
    if (!expiryAt) return;

    const update = () => {
      const value = this.countdown.format(expiryAt);
      this.countdownDisplay.set(value);
      if (value === 'Expired') this.stopCountdown();
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  private stopCountdown(): void {
    if (!this.countdownInterval) return;
    clearInterval(this.countdownInterval);
    this.countdownInterval = null;
  }
}
