import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SharexService } from '../../services/sharex.service';
import { ContentType, Share, ShareFile, timeAgo, timeUntil } from '../../models/share.model';
import { ContentViewerComponent } from '../../components/content-viewer/content-viewer.component';
import { FileListComponent } from '../../components/file-list/file-list.component';

type ViewState = 'loading' | 'locked' | 'content' | 'not_found' | 'burned' | 'expired' | 'view_limit';

interface ShareData {
  share: Share;
  files: ShareFile[];
}

@Component({
  selector: 'app-sharex-view',
  standalone: true,
  imports: [RouterLink, FormsModule, ContentViewerComponent, FileListComponent],
  templateUrl: './sharex-view.component.html',
  styleUrl: './sharex-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sharexService = inject(SharexService);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  readonly viewState = signal<ViewState>('loading');
  readonly shareData = signal<ShareData | null>(null);
  readonly copied = signal(false);
  readonly linkCopied = signal(false);
  readonly isBurned = signal(false);

  // Password
  readonly passwordInput = signal('');
  readonly passwordError = signal(false);
  readonly isVerifying = signal(false);

  readonly timeAgo = timeAgo;
  readonly timeUntil = timeUntil;

  private shareCode = '';

  async ngOnInit(): Promise<void> {
    this.shareCode = this.route.snapshot.paramMap.get('code') || '';
    if (!this.shareCode) {
      this.viewState.set('not_found');
      return;
    }

    try {
      const result = await this.sharexService.getShareMeta(this.shareCode);

      switch (result.status) {
        case 'not_found':
          this.viewState.set('not_found');
          this.titleService.setTitle('Share Not Found — ShareX');
          return;

        case 'expired':
          this.viewState.set('expired');
          this.titleService.setTitle('Share Expired — ShareX');
          return;

        case 'view_limit':
          this.viewState.set('view_limit');
          this.titleService.setTitle('View Limit Reached — ShareX');
          return;

        case 'burned':
          this.viewState.set('burned');
          this.titleService.setTitle('Share Destroyed — ShareX');
          return;

        case 'ok':
          this.shareData.set({ share: result.share, files: result.files });
          const shareTitle = result.share.title || 'Shared Content';
          this.titleService.setTitle(`${shareTitle} — ShareX`);
          this.meta.updateTag({ name: 'description', content: `View shared content on ShareX: ${shareTitle}` });

          // Check if password-protected
          if (result.share.password_hash) {
            this.viewState.set('locked');
          } else {
            // No password — show content and record view
            await this.onSuccessfulAccess(result.share);
            this.viewState.set('content');
          }
          break;
      }
    } catch {
      this.viewState.set('not_found');
    }
  }

  async unlockShare(): Promise<void> {
    const pwd = this.passwordInput().trim();
    if (!pwd) {
      this.passwordError.set(true);
      return;
    }

    const share = this.shareData()?.share;
    if (!share?.password_hash) return;

    this.isVerifying.set(true);
    this.passwordError.set(false);

    try {
      const valid = await this.sharexService.verifyPassword(pwd, share.share_code, share.password_hash);

      if (valid) {
        await this.onSuccessfulAccess(share);
        this.viewState.set('content');
      } else {
        this.passwordError.set(true);
        this.passwordInput.set('');
      }
    } catch {
      this.passwordError.set(true);
    } finally {
      this.isVerifying.set(false);
    }
  }

  /**
   * Called after content is successfully accessed (password verified or no password).
   * Records the view and handles burn-after-read marking.
   *
   * Burn-after-read uses a "delete on next access" pattern:
   * - First view: content shown, view_count incremented to 1
   * - Next access: getShareMeta sees view_count > 0, returns 'burned' status
   * - No immediate file deletion — avoids accidental loss on page refresh
   */
  private async onSuccessfulAccess(share: Share): Promise<void> {
    // Record the view
    await this.sharexService.recordView(share.id, share.view_count);

    // For burn-after-read: mark as consumed (view_count is now > 0).
    // On next access, getShareMeta will return status 'burned'.
    if (share.is_burn_after_read) {
      this.isBurned.set(true);
    }
  }

  getContentType(): ContentType {
    return (this.shareData()?.share.content_type as ContentType) || 'text';
  }

  isPasswordProtected(): boolean {
    return !!this.shareData()?.share.password_hash;
  }

  getViewInfo(): string | null {
    const share = this.shareData()?.share;
    if (!share?.view_limit) return null;
    return `${share.view_count + 1}/${share.view_limit}`;
  }

  async copyContent(): Promise<void> {
    const content = this.shareData()?.share.content;
    if (!content) return;
    await navigator.clipboard.writeText(content);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2500);
  }

  async copyLink(): Promise<void> {
    const code = this.shareData()?.share.share_code;
    if (!code) return;
    const url = this.sharexService.getShareUrl(code);
    await navigator.clipboard.writeText(url);
    this.linkCopied.set(true);
    setTimeout(() => this.linkCopied.set(false), 2500);
  }
}

