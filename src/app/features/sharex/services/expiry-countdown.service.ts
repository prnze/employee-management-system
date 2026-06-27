import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExpiryCountdownService {
  format(expiryAt: string | null | undefined): string | null {
    if (!expiryAt) return null;

    const diff = new Date(expiryAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    if (days > 0) {
      return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    }

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
}
