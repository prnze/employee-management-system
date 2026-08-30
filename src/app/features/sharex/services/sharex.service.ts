import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { ShareCodeService } from './share-code.service';
import { PasswordService } from './password.service';
import { CreateSharePayload, expiryToDate, Share, ShareFile } from '../models/share.model';

export type ShareStatus = 'ok' | 'expired' | 'view_limit' | 'burned' | 'not_found';

export type ProtectedShareMetadata = Pick<
  Share,
  | 'id'
  | 'share_code'
  | 'title'
  | 'content_type'
  | 'password_hash'
  | 'expiry_at'
  | 'view_limit'
  | 'view_count'
  | 'is_burn_after_read'
>;

@Injectable({ providedIn: 'root' })
export class SharexService {
  private readonly supabase = inject(SupabaseService);
  private readonly shareCode = inject(ShareCodeService);
  private readonly passwordService = inject(PasswordService);

  async createShare(payload: CreateSharePayload): Promise<Share> {
    const code = payload.custom_code || this.shareCode.generate();
    const expiryAt = expiryToDate(payload.expiry_option, payload.custom_expiry_at);

    const { data, error } = await this.supabase.client
      .rpc('sharex_create_share', {
        p_share_code: code,
        p_title: payload.title || null,
        p_content: payload.content || null,
        p_content_type: payload.content_type || 'text',
        p_language: payload.language || null,
        p_password: payload.password || null,
        p_expiry_at: expiryAt,
        p_view_limit: payload.view_limit || null,
        p_is_burn_after_read: payload.is_burn_after_read || false
      });

    if (error) {
      if (this.isMissingRpc(error)) {
        return this.createShareWithLegacySchema(payload, code, expiryAt);
      }
      if (error.code === '23505' && payload.custom_code) {
        throw new Error('This custom URL is already taken. Please choose another.');
      }
      throw new Error(error.message);
    }

    return data as Share;
  }

  async fetchProtectedMetadata(code: string): Promise<{ share: ProtectedShareMetadata | null; status: ShareStatus }> {
    const { data: share, error } = await this.supabase.client
      .rpc('sharex_get_metadata', { p_code: code })
      .single();

    if (error || !share) {
      if (error && this.isMissingRpc(error)) {
        return this.fetchProtectedMetadataWithLegacySchema(code);
      }
      return { share: null, status: 'not_found' };
    }

    const metadata = share as unknown as ProtectedShareMetadata;
    const status = this.getShareStatus(metadata);

    return { share: metadata, status };
  }

  async fetchFullShare(id: string, password?: string): Promise<{ share: Share; files: ShareFile[] }> {
    const { data, error } = await this.supabase.client
      .rpc('sharex_get_full_share', {
        p_share_id: id,
        p_password: password || null
      });

    if (error || !data) {
      if (error && this.isMissingRpc(error)) {
        return this.fetchFullShareWithLegacySchema(id, password);
      }
      throw new Error('Share not found.');
    }

    const payload = data as { share?: Share; files?: ShareFile[] };
    if (!payload.share) {
      throw new Error('Share not found.');
    }

    const fullShare = payload.share;
    const status = this.getShareStatus(fullShare);
    if (status !== 'ok') {
      throw new Error(`Share is ${status}.`);
    }

    return {
      share: fullShare,
      files: payload.files || []
    };
  }

  /**
   * Compatibility wrapper for callers that still expect metadata plus files.
   * Protected shares intentionally return metadata only until password unlock.
   */
  async getShareMeta(code: string): Promise<{ share: Share; files: ShareFile[]; status: ShareStatus }> {
    const result = await this.fetchProtectedMetadata(code);

    if (result.status !== 'ok' || !result.share) {
      return { share: result.share as unknown as Share, files: [], status: result.status };
    }

    if (result.share.password_hash) {
      return { share: result.share as unknown as Share, files: [], status: 'ok' };
    }

    const full = await this.fetchFullShare(result.share.id);
    return { ...full, status: 'ok' };
  }

  async recordView(shareId: string, currentCount: number): Promise<void> {
    await this.supabase.client
      .rpc('sharex_record_view', {
        p_share_id: shareId,
        p_current_count: currentCount
      });
  }

  async recordDownload(shareId: string): Promise<void> {
    await this.supabase.client
      .rpc('sharex_record_download', { p_share_id: shareId });
  }

  async verifyPassword(password: string, shareCode: string, storedHash: string): Promise<boolean> {
    return this.passwordService.verifyPassword(password, shareCode, storedHash);
  }

  async getSharesByIds(ids: string[]): Promise<{ data: Share[] | null }> {
    if (ids.length === 0) return { data: [] };

    const { data, error } = await this.supabase.client
      .rpc('sharex_get_dashboard_shares', { p_ids: ids });

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

  private getShareStatus(share: Pick<Share, 'expiry_at' | 'view_limit' | 'view_count' | 'is_burn_after_read'>): ShareStatus {
    if (share.expiry_at && new Date(share.expiry_at) < new Date()) return 'expired';
    if (share.view_limit && share.view_count >= share.view_limit) return 'view_limit';
    if (share.is_burn_after_read && share.view_count > 0) return 'burned';
    return 'ok';
  }

  private async createShareWithLegacySchema(
    payload: CreateSharePayload,
    code: string,
    expiryAt: string | null
  ): Promise<Share> {
    const passwordHash = payload.password?.trim()
      ? await this.passwordService.hashPassword(payload.password, code)
      : null;

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

    if (error) {
      if (error.code === '23505' && payload.custom_code) {
        throw new Error('This custom URL is already taken. Please choose another.');
      }
      throw new Error(error.message);
    }

    return data as Share;
  }

  private async fetchProtectedMetadataWithLegacySchema(code: string): Promise<{ share: ProtectedShareMetadata | null; status: ShareStatus }> {
    const { data, error } = await this.supabase.client
      .from('shares')
      .select('id, share_code, title, content_type, password_hash, expiry_at, view_limit, view_count, is_burn_after_read')
      .eq('share_code', code)
      .maybeSingle();

    if (error || !data) return { share: null, status: 'not_found' };

    const share = data as ProtectedShareMetadata;
    return { share, status: this.getShareStatus(share) };
  }

  private async fetchFullShareWithLegacySchema(id: string, password?: string): Promise<{ share: Share; files: ShareFile[] }> {
    const { data: share, error: shareError } = await this.supabase.client
      .from('shares')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (shareError || !share) throw new Error('Share not found.');

    const fullShare = share as Share;
    if (this.getShareStatus(fullShare) !== 'ok') throw new Error('Share not found.');
    if (fullShare.password_hash && (!password || !(await this.verifyPassword(password, fullShare.share_code, fullShare.password_hash)))) {
      throw new Error('Share not found.');
    }

    const { data: files, error: filesError } = await this.supabase.client
      .from('share_files')
      .select('*')
      .eq('share_id', id)
      .order('created_at');

    if (filesError) throw new Error(filesError.message);
    return { share: fullShare, files: (files || []) as ShareFile[] };
  }

  private isMissingRpc(error: { code?: string; message?: string }): boolean {
    return error.code === 'PGRST202' || /could not find (the )?function/i.test(error.message || '');
  }
}
