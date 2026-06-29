import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UploadState } from '../../services/upload-manager.service';

@Component({
  selector: 'app-upload-progress',
  standalone: true,
  template: `
    @if (state(); as s) {
      <div class="sx-upload-progress" [class.sx-upload-progress--success]="s.status === 'success'" [class.sx-upload-progress--error]="s.status === 'error'">
        <!-- Status Icon -->
        <div class="sx-upload-status-icon">
          @if (s.status === 'uploading') {
            <div class="sx-upload-spinner"></div>
          } @else if (s.status === 'success') {
            <span class="material-symbols-rounded sx-upload-icon-success">check_circle</span>
          } @else {
            <span class="material-symbols-rounded sx-upload-icon-error">error</span>
          }
        </div>

        <!-- Info -->
        <div class="sx-upload-info">
          <div class="sx-upload-header-row">
            <span class="sx-upload-label">
              @if (s.status === 'uploading') {
                Uploading {{ s.currentFileName }}
              } @else if (s.status === 'success') {
                Upload complete
              } @else {
                Upload failed
              }
            </span>
            <span class="sx-upload-percent">{{ s.percent }}%</span>
          </div>

          <!-- Progress Bar -->
          <div class="sx-upload-bar-track">
            <div
              class="sx-upload-bar-fill"
              [style.width.%]="s.percent"
              [class.sx-upload-bar-fill--success]="s.status === 'success'"
              [class.sx-upload-bar-fill--error]="s.status === 'error'">
            </div>
          </div>

          <!-- Meta row -->
          <div class="sx-upload-meta-row">
            @if (s.totalFiles > 1) {
              <span class="sx-upload-meta">File {{ s.fileIndex + 1 }} of {{ s.totalFiles }}</span>
            }
            @if (s.status === 'uploading') {
              <span class="sx-upload-meta">{{ s.speed }}</span>
              <span class="sx-upload-meta">ETA {{ s.eta }}</span>
            }
            @if (s.status === 'error' && s.errorMessage) {
              <span class="sx-upload-meta sx-upload-meta--error">{{ s.errorMessage }}</span>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .sx-upload-progress {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 20px;
      border-radius: var(--sx-radius-md, 16px);
      background: var(--sx-card, rgba(255,255,255,.05));
      border: 1px solid var(--sx-accent-border, rgba(10,132,255,.28));
      animation: upload-progress-in var(--sx-duration-4, 300ms) var(--sx-ease, cubic-bezier(.22,1,.36,1)) both;

      &--success {
        border-color: color-mix(in srgb, var(--sx-success, #30D158) 28%, transparent);
        background: color-mix(in srgb, var(--sx-success, #30D158) 10%, transparent);
      }

      &--error {
        border-color: color-mix(in srgb, var(--sx-danger, #FF453A) 28%, transparent);
        background: color-mix(in srgb, var(--sx-danger, #FF453A) 10%, transparent);
      }
    }

    @keyframes upload-progress-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .sx-upload-status-icon {
      flex-shrink: 0;
      padding-top: 2px;
    }

    .sx-upload-spinner {
      width: 22px;
      height: 22px;
      border: 2.5px solid var(--sx-accent-soft, rgba(10,132,255,.14));
      border-top-color: var(--sx-accent, #0A84FF);
      border-radius: 50%;
      animation: upload-spin 0.8s linear infinite;
    }

    @keyframes upload-spin {
      to { transform: rotate(360deg); }
    }

    .sx-upload-icon-success {
      font-size: 1.4rem;
      color: var(--sx-success, #30D158);
    }

    .sx-upload-icon-error {
      font-size: 1.4rem;
      color: var(--sx-danger, #FF453A);
    }

    .sx-upload-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sx-upload-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .sx-upload-label {
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--sx-text, rgba(255, 255, 255, 0.85));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sx-upload-percent {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--sx-accent, #0A84FF);
      font-family: var(--sx-font-mono, monospace);
      flex-shrink: 0;
    }

    .sx-upload-bar-track {
      height: 6px;
      border-radius: 999px;
      background: var(--sx-input, rgba(255, 255, 255, 0.055));
      overflow: hidden;
    }

    .sx-upload-bar-fill {
      height: 100%;
      border-radius: 999px;
      background: var(--sx-accent, #0A84FF);
      transition: width var(--sx-duration-4, 300ms) var(--sx-ease, cubic-bezier(.22,1,.36,1));
      position: relative;

      &--success {
        background: var(--sx-success, #30D158);
      }

      &--error {
        background: var(--sx-danger, #FF453A);
      }
    }

    .sx-upload-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .sx-upload-meta {
      font-size: 0.72rem;
      color: var(--sx-text-muted, rgba(255, 255, 255, 0.35));
      font-family: var(--sx-font-mono, monospace);

      &--error {
        color: var(--sx-danger, #FF453A);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadProgressComponent {
  readonly state = input<UploadState | null>(null);
}
