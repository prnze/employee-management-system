import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly pepper = 'sharex-v1';

  /**
   * Hash a password using SHA-256 with share code as salt and a static pepper.
   * Format: SHA-256(password:shareCode:pepper) → hex string
   */
  async hashPassword(password: string, shareCode: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${password.trim()}:${shareCode.trim()}:${this.pepper}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Verify a password against a stored hash.
   */
  async verifyPassword(password: string, shareCode: string, storedHash: string): Promise<boolean> {
    const computedHash = await this.hashPassword(password, shareCode);
    return computedHash === storedHash;
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
