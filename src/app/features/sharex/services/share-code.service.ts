import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareCodeService {
  private readonly charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private readonly length = 6;

  generate(): string {
    const values = new Uint8Array(this.length);
    crypto.getRandomValues(values);
    return Array.from(values, (v) => this.charset[v % this.charset.length]).join('');
  }
}
