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
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(139, 92, 246, 0.15);
      animation: upload-progress-in 0.3s ease both;

      &--success {
        border-color: rgba(16, 185, 129, 0.2);
        background: rgba(16, 185, 129, 0.04);
      }

      &--error {
        border-color: rgba(239, 68, 68, 0.2);
        background: rgba(239, 68, 68, 0.04);
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
      border: 2.5px solid rgba(139, 92, 246, 0.2);
      border-top-color: #a78bfa;
      border-radius: 50%;
      animation: upload-spin 0.8s linear infinite;
    }

    @keyframes upload-spin {
      to { transform: rotate(360deg); }
    }

    .sx-upload-icon-success {
      font-size: 1.4rem;
      color: #34d399;
    }

    .sx-upload-icon-error {
      font-size: 1.4rem;
      color: #f87171;
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
      color: rgba(255, 255, 255, 0.85);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sx-upload-percent {
      font-size: 0.82rem;
      font-weight: 700;
      color: #a78bfa;
      font-family: var(--sx-font-mono, monospace);
      flex-shrink: 0;
    }

    .sx-upload-bar-track {
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      overflow: hidden;
    }

    .sx-upload-bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #8b5cf6, #06b6d4);
      transition: width 0.3s ease;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%);
        background-size: 200% 100%;
        animation: upload-shimmer 1.5s ease-in-out infinite;
      }

      &--success {
        background: linear-gradient(90deg, #10b981, #34d399);

        &::after { display: none; }
      }

      &--error {
        background: linear-gradient(90deg, #ef4444, #f87171);

        &::after { display: none; }
      }
    }

    @keyframes upload-shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }

    .sx-upload-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .sx-upload-meta {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.35);
      font-family: var(--sx-font-mono, monospace);

      &--error {
        color: #fca5a5;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadProgressComponent {
  readonly state = input<UploadState | null>(null);
}
