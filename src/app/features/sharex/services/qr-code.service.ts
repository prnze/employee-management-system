import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({ providedIn: 'root' })
export class QrCodeService {
  /**
   * Generate a QR code as a data URL (PNG).
   * Uses dark background with light QR modules to match the ShareX dark theme.
   */
  async generate(text: string): Promise<string> {
    return QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: '#ffffffee',
        light: '#00000000'
      },
      errorCorrectionLevel: 'M'
    });
  }

  /**
   * Download the QR code as a PNG file.
   */
  async download(text: string, filename: string): Promise<void> {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 512,
      margin: 3,
      color: {
        dark: '#ffffff',
        light: '#0c0c14'
      },
      errorCorrectionLevel: 'H'
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
  }
}
