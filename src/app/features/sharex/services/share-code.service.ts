import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class ShareCodeService {
  private readonly supabase = inject(SupabaseService);
  private readonly charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private readonly length = 6;

  generate(): string {
    const values = new Uint8Array(this.length);
    crypto.getRandomValues(values);
    return Array.from(values, (v) => this.charset[v % this.charset.length]).join('');
  }

  /**
   * Check if a custom share code is available (not already used).
   */
  async checkAvailability(code: string): Promise<{ available: boolean }> {
    const { data, error } = await this.supabase.client
      .rpc('sharex_check_code_available', { p_code: code });

    if (error) throw new Error(error.message);
    return { available: !!data };
  }
}
