import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Share } from '../../models/share.model';
import { SharexService } from '../../services/sharex.service';
import { QrCodeService } from '../../services/qr-code.service';

@Component({
  selector: 'app-share-result-modal',
  standalone: true,
  templateUrl: './share-result-modal.component.html',
  styleUrl: './share-result-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareResultModalComponent implements OnInit {
  private readonly sharexService = inject(SharexService);
  private readonly qrService = inject(QrCodeService);

  readonly share = input.required<Share>();
  readonly closed = output<void>();

  readonly copied = signal(false);
  readonly codeCopied = signal(false);
  readonly qrDataUrl = signal<string | null>(null);
  readonly canShare = signal(false);

  get shareUrl(): string {
    return this.sharexService.getShareUrl(this.share().share_code);
  }

  get shareCode(): string {
    return this.share().share_code;
  }

  async ngOnInit(): Promise<void> {
    // Check native share support
    this.canShare.set(typeof navigator.share === 'function');

    // Generate QR code
    try {
      const dataUrl = await this.qrService.generate(this.shareUrl);
      this.qrDataUrl.set(dataUrl);
    } catch {
      // QR generation failed — modal still works without it
    }
  }

  async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(this.shareUrl);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2500);
  }

  async copyShareCode(): Promise<void> {
    await navigator.clipboard.writeText(this.shareCode);
    this.codeCopied.set(true);
    setTimeout(() => this.codeCopied.set(false), 2500);
  }

  openLink(): void {
    window.open(this.shareUrl, '_blank', 'noopener,noreferrer');
  }

  async downloadQR(): Promise<void> {
    const filename = `sharex-${this.shareCode}`;
    await this.qrService.download(this.shareUrl, filename);
  }

  async nativeShare(): Promise<void> {
    try {
      await navigator.share({
        title: this.share().title || 'ShareX Link',
        text: `Check out this shared content`,
        url: this.shareUrl
      });
    } catch {
      // User cancelled or share failed — fall back to copy
      await this.copyLink();
    }
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
