import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { ShareFile } from '../models/share.model';

@Injectable({ providedIn: 'root' })
export class SharexStorageService {
  private readonly supabase = inject(SupabaseService);
  private readonly bucket = 'sharex-files';
  private readonly maxFileSize = 50 * 1024 * 1024;

  async uploadFiles(shareId: string, files: File[]): Promise<ShareFile[]> {
    const results: ShareFile[] = [];

    for (const file of files) {
      if (file.size > this.maxFileSize) {
        throw new Error(`File "${file.name}" exceeds the 50 MB limit.`);
      }
      if (file.size === 0) {
        throw new Error(`File "${file.name}" is empty.`);
      }

      const displayPath = this.getRelativePath(file);
      const storagePath = `${shareId}/${Date.now()}_${this.sanitizePath(displayPath)}`;

      const { error: uploadError } = await this.supabase.client.storage
        .from(this.bucket)
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: record, error: dbError } = await this.supabase.client
        .from('share_files')
        .insert({
          share_id: shareId,
          file_name: displayPath,
          storage_path: storagePath,
          mime_type: file.type || 'application/octet-stream',
          size: file.size
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);
      results.push(record as unknown as ShareFile);
    }

    return results;
  }

  getPublicUrl(storagePath: string): string {
    return this.supabase.client.storage
      .from(this.bucket)
      .getPublicUrl(storagePath).data.publicUrl;
  }

  async getSignedUrl(storagePath: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await this.supabase.client.storage
      .from(this.bucket)
      .createSignedUrl(storagePath, expiresIn);

    if (error) throw new Error(error.message);
    return data.signedUrl;
  }

  async deleteShareFiles(shareId: string): Promise<void> {
    const { data, error } = await this.supabase.client.storage
      .from(this.bucket)
      .list(shareId);

    if (error || !data?.length) return;

    const paths = data.map((item) => `${shareId}/${item.name}`);
    await this.supabase.client.storage.from(this.bucket).remove(paths);
  }

  private getRelativePath(file: File): string {
    const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
    return relativePath || file.name;
  }

  private sanitizePath(path: string): string {
    return path
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, '_'))
      .join('/');
  }
}
