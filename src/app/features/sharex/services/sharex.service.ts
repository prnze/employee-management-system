import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { ShareCodeService } from './share-code.service';
import { PasswordService } from './password.service';
import { CreateSharePayload, expiryToDate, Share, ShareFile } from '../models/share.model';

@Injectable({ providedIn: 'root' })
export class SharexService {
  private readonly supabase = inject(SupabaseService);
  private readonly shareCode = inject(ShareCodeService);
  private readonly passwordService = inject(PasswordService);

  async createShare(payload: CreateSharePayload): Promise<Share> {
    const code = this.shareCode.generate();
    const expiryAt = expiryToDate(payload.expiry_option, payload.custom_expiry_at);

    let passwordHash: string | null = null;
    if (payload.password?.trim()) {
      passwordHash = await this.passwordService.hashPassword(payload.password.trim(), code);
    }

    const { data, error } = await this.supabase.client
      .from('shares')
      .insert({
        share_code: code,
        title: payload.title || null,
        content: payload.content || null,
        content_type: payload.content_type || 'text',
        language: payload.language || null,
        password_hash: passwordHash,
        expiry_at: expiryAt,
        view_limit: payload.view_limit || null,
        is_burn_after_read: payload.is_burn_after_read || false
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Share;
  }

  /**
   * Retrieve share metadata without incrementing view count.
   * Used to check if share exists, is password-protected, or is expired.
   * Content is included — the view component controls visibility.
   */
  async getShareMeta(code: string): Promise<{ share: Share; files: ShareFile[]; status: 'ok' | 'expired' | 'view_limit' | 'burned' | 'not_found' }> {
    const { data: share, error } = await this.supabase.client
      .from('shares')
      .select('*')
      .eq('share_code', code)
      .single();

    if (error || !share) {
      return { share: null as unknown as Share, files: [], status: 'not_found' };
    }

    // Check expiry
    if (share['expiry_at'] && new Date(share['expiry_at'] as string) < new Date()) {
      return { share: share as unknown as Share, files: [], status: 'expired' };
    }

    // Check view limit
    if (share['view_limit'] && (share['view_count'] as number) >= (share['view_limit'] as number)) {
      return { share: share as unknown as Share, files: [], status: 'view_limit' };
    }

    // Check burn-after-read: if already consumed (view_count > 0 and is_burn_after_read)
    if (share['is_burn_after_read'] && (share['view_count'] as number) > 0) {
      return { share: share as unknown as Share, files: [], status: 'burned' };
    }

    const { data: files } = await this.supabase.client
      .from('share_files')
      .select('*')
      .eq('share_id', share['id']);

    return {
      share: share as unknown as Share,
      files: ((files || []) as unknown[]) as ShareFile[],
      status: 'ok'
    };
  }

  /**
   * Increment view count after successful access (including password unlock).
   */
  async recordView(shareId: string, currentCount: number): Promise<void> {
    await this.supabase.client
      .from('shares')
      .update({ view_count: currentCount + 1 })
      .eq('id', shareId);
  }

  /**
   * Verify password for a protected share.
   */
  async verifyPassword(password: string, shareCode: string, storedHash: string): Promise<boolean> {
    return this.passwordService.verifyPassword(password, shareCode, storedHash);
  }

  /**
   * Fetch multiple shares by their IDs for dashboard hydration.
   * Returns only id, view_count, view_limit, expiry_at, is_burn_after_read for efficiency.
   */
  async getSharesByIds(ids: string[]): Promise<{ data: Share[] | null }> {
    if (ids.length === 0) return { data: [] };

    const { data, error } = await this.supabase.client
      .from('shares')
      .select('id, view_count, view_limit, expiry_at, is_burn_after_read')
      .in('id', ids);

    if (error) return { data: null };
    return { data: (data as unknown[]) as Share[] };
  }

  async deleteShare(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('shares')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  getShareUrl(code: string): string {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/sharex/s/${code}`;
  }
}
