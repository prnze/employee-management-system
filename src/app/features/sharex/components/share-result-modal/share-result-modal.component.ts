import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Share } from '../../models/share.model';
import { SharexService } from '../../services/sharex.service';

@Component({
  selector: 'app-share-result-modal',
  standalone: true,
  templateUrl: './share-result-modal.component.html',
  styleUrl: './share-result-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareResultModalComponent {
  private readonly sharexService = inject(SharexService);

  readonly share = input.required<Share>();
  readonly closed = output<void>();
  readonly copied = signal(false);

  get shareUrl(): string {
    return this.sharexService.getShareUrl(this.share().share_code);
  }

  async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(this.shareUrl);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2500);
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
