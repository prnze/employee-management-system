import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Share } from '../../models/share.model';
import { SharexService } from '../../services/sharex.service';
import { QrCodeService } from '../../services/qr-code.service';
import { ExpiryCountdownService } from '../../services/expiry-countdown.service';

@Component({
  selector: 'app-share-result-modal',
  standalone: true,
  templateUrl: './share-result-modal.component.html',
  styleUrl: './share-result-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareResultModalComponent implements OnInit, OnDestroy {
  private readonly sharexService = inject(SharexService);
  private readonly qrService = inject(QrCodeService);
  private readonly countdown = inject(ExpiryCountdownService);
  private readonly document = inject(DOCUMENT);

  readonly share = input.required<Share>();
  readonly closed = output<void>();

  readonly copied = signal(false);
  readonly codeCopied = signal(false);
  readonly qrDataUrl = signal<string | null>(null);
  readonly canShare = signal(false);
  readonly countdownDisplay = signal<string | null>(null);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  get shareUrl(): string {
    return this.sharexService.getShareUrl(this.share().share_code);
  }

  get shareCode(): string {
    return this.share().share_code;
  }

  async ngOnInit(): Promise<void> {
    this.document.body.classList.add('sx-sharex-modal-open');

    // Check native share support
    this.canShare.set(typeof navigator.share === 'function');

    // Generate QR code
    try {
      const dataUrl = await this.qrService.generate(this.shareUrl);
      this.qrDataUrl.set(dataUrl);
    } catch {
      // QR generation failed — modal still works without it
    }

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
    this.document.body.classList.remove('sx-sharex-modal-open');
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

  private startCountdown(): void {
    const expiryAt = this.share().expiry_at;
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
