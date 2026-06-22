import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { ShareCodeService } from './share-code.service';
import { CreateSharePayload, expiryToDate, Share, ShareFile } from '../models/share.model';

@Injectable({ providedIn: 'root' })
export class SharexService {
  private readonly supabase = inject(SupabaseService);
  private readonly shareCode = inject(ShareCodeService);

  async createShare(payload: CreateSharePayload): Promise<Share> {
    const code = this.shareCode.generate();
    const expiryAt = expiryToDate(payload.expiry_option);

    const { data, error } = await this.supabase.client
      .from('shares')
      .insert({
        share_code: code,
        title: payload.title || null,
        content: payload.content || null,
        content_type: payload.content_type || 'text',
        language: payload.language || null,
        expiry_at: expiryAt,
        view_limit: payload.view_limit || null,
        is_burn_after_read: payload.is_burn_after_read || false
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Share;
  }

  async getShare(code: string): Promise<{ share: Share; files: ShareFile[] } | null> {
    const { data: share, error } = await this.supabase.client
      .from('shares')
      .select('*')
      .eq('share_code', code)
      .single();

    if (error || !share) return null;

    if (share['expiry_at'] && new Date(share['expiry_at'] as string) < new Date()) {
      return null;
    }

    if (share['view_limit'] && (share['view_count'] as number) >= (share['view_limit'] as number)) {
      return null;
    }

    const { data: files } = await this.supabase.client
      .from('share_files')
      .select('*')
      .eq('share_id', share['id']);

    await this.supabase.client
      .from('shares')
      .update({ view_count: ((share['view_count'] as number) || 0) + 1 })
      .eq('id', share['id']);

    return {
      share: share as unknown as Share,
      files: ((files || []) as unknown[]) as ShareFile[]
    };
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
