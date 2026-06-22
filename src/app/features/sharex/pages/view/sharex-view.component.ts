import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SharexService } from '../../services/sharex.service';
import { ContentType, Share, ShareFile, timeAgo, timeUntil } from '../../models/share.model';
import { ContentViewerComponent } from '../../components/content-viewer/content-viewer.component';
import { FileListComponent } from '../../components/file-list/file-list.component';

interface ShareData {
  share: Share;
  files: ShareFile[];
}

@Component({
  selector: 'app-sharex-view',
  standalone: true,
  imports: [RouterLink, ContentViewerComponent, FileListComponent],
  templateUrl: './sharex-view.component.html',
  styleUrl: './sharex-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sharexService = inject(SharexService);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  readonly loading = signal(true);
  readonly shareData = signal<ShareData | null>(null);
  readonly copied = signal(false);
  readonly linkCopied = signal(false);

  readonly timeAgo = timeAgo;
  readonly timeUntil = timeUntil;

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.paramMap.get('code');
    if (!code) {
      this.loading.set(false);
      return;
    }

    try {
      const result = await this.sharexService.getShare(code);
      this.shareData.set(result);

      if (result) {
        const shareTitle = result.share.title || 'Shared Content';
        this.titleService.setTitle(`${shareTitle} — ShareX`);
        this.meta.updateTag({ name: 'description', content: `View shared content on ShareX: ${shareTitle}` });
      } else {
        this.titleService.setTitle('Share Not Found — ShareX');
      }
    } catch {
      this.shareData.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  getContentType(): ContentType {
    return (this.shareData()?.share.content_type as ContentType) || 'text';
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
