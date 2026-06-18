import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly supabase = inject(SupabaseService);

  private readonly avatarBucket = 'employee-avatars';
  private readonly attachmentBucket = 'attachments';
  private readonly documentBucket = 'documents';

  private readonly avatarMaxBytes = 2 * 1024 * 1024;
  private readonly fileMaxBytes = 10 * 1024 * 1024;

  private readonly avatarTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
  private readonly avatarExtensions = new Set(['png', 'jpg', 'jpeg', 'webp']);
  private readonly attachmentTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
  private readonly attachmentExtensions = new Set(['pdf', 'png', 'jpg', 'jpeg']);
  private readonly documentTypes = new Set([
    'application/pdf',
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]);
  private readonly documentExtensions = new Set(['pdf', 'csv', 'xls', 'xlsx']);

  validateAvatar(file: File): void {
    this.validateFile(file, this.avatarMaxBytes, this.avatarTypes, this.avatarExtensions, 'avatar');
  }

  validateAttachment(file: File): void {
    this.validateFile(file, this.fileMaxBytes, this.attachmentTypes, this.attachmentExtensions, 'attachment');
  }

  validateDocument(file: File): void {
    this.validateFile(file, this.fileMaxBytes, this.documentTypes, this.documentExtensions, 'document');
  }

  async uploadAvatar(employeeId: string, file: File): Promise<string> {
    this.validateAvatar(file);
    const path = this.timestampedPath(employeeId, file);
    await this.upload(this.avatarBucket, path, file);
    await this.deleteFolderObjects(this.avatarBucket, employeeId, path);
    return this.publicUrl(this.avatarBucket, path);
  }

  async deleteAvatar(employeeId: string): Promise<void> {
    await this.deleteFolderObjects(this.avatarBucket, employeeId);
  }

  async getAvatarUrl(employeeId: string): Promise<string | null> {
    const latest = await this.latestObject(this.avatarBucket, employeeId);
    return latest ? this.publicUrl(this.avatarBucket, `${employeeId}/${latest.name}`) : null;
  }

  async uploadAttachment(entityId: string, file: File): Promise<string> {
    this.validateAttachment(file);
    const path = this.timestampedPath(entityId, file);
    await this.upload(this.attachmentBucket, path, file);
    return path;
  }

  async deleteAttachment(path: string): Promise<void> {
    await this.remove(this.attachmentBucket, [path]);
  }

  async getAttachmentUrl(path: string, expiresIn = 3600): Promise<string> {
    return this.signedUrl(this.attachmentBucket, path, expiresIn);
  }

  async uploadDocument(entityId: string, file: File): Promise<string> {
    this.validateDocument(file);
    const path = this.timestampedPath(entityId, file);
    await this.upload(this.documentBucket, path, file);
    return path;
  }

  async deleteDocument(path: string): Promise<void> {
    await this.remove(this.documentBucket, [path]);
  }

  async getDocumentUrl(path: string, expiresIn = 3600): Promise<string> {
    return this.signedUrl(this.documentBucket, path, expiresIn);
  }

  private validateFile(
    file: File,
    maxBytes: number,
    allowedTypes: Set<string>,
    allowedExtensions: Set<string>,
    label: string
  ): void {
    const extension = this.extension(file.name);
    if (!allowedTypes.has(file.type.toLowerCase()) || !allowedExtensions.has(extension)) {
      throw new Error(`Unsupported ${label} file type.`);
    }
    if (file.size > maxBytes) {
      throw new Error(`${this.capitalize(label)} files must be ${maxBytes / 1024 / 1024}MB or smaller.`);
    }
    if (file.size === 0) {
      throw new Error(`${this.capitalize(label)} file cannot be empty.`);
    }
  }

  private timestampedPath(entityId: string, file: File): string {
    const safeEntityId = entityId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    if (!safeEntityId) {
      throw new Error('A valid entity ID is required.');
    }
    return `${safeEntityId}/${Date.now()}.${this.extension(file.name)}`;
  }

  private extension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() ?? '';
  }

  private async upload(bucket: string, path: string, file: File): Promise<void> {
    const { error } = await this.supabase.client.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
  }

  private async remove(bucket: string, paths: string[]): Promise<void> {
    if (paths.length === 0) return;
    const { error } = await this.supabase.client.storage.from(bucket).remove(paths);
    if (error) throw new Error(error.message);
  }

  private async deleteFolderObjects(bucket: string, entityId: string, exceptPath?: string): Promise<void> {
    const { data, error } = await this.supabase.client.storage.from(bucket).list(entityId);
    if (error) throw new Error(error.message);
    const paths = (data ?? [])
      .map((item) => `${entityId}/${item.name}`)
      .filter((path) => path !== exceptPath);
    await this.remove(bucket, paths);
  }

  private async latestObject(bucket: string, entityId: string): Promise<{ name: string } | null> {
    const { data, error } = await this.supabase.client.storage
      .from(bucket)
      .list(entityId, { sortBy: { column: 'name', order: 'desc' }, limit: 1 });
    if (error) throw new Error(error.message);
    return data?.[0] ?? null;
  }

  private publicUrl(bucket: string, path: string): string {
    return this.supabase.client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  private async signedUrl(bucket: string, path: string, expiresIn: number): Promise<string> {
    const { data, error } = await this.supabase.client.storage.from(bucket).createSignedUrl(path, expiresIn);
    if (error) throw new Error(error.message);
    return data.signedUrl;
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
