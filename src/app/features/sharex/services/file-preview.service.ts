import { inject, Injectable } from '@angular/core';
import { ShareFile } from '../models/share.model';
import { SharexStorageService } from './sharex-storage.service';

export type PreviewType = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'unsupported';

export interface PreviewData {
  type: PreviewType;
  url: string;
  textContent?: string;
  mimeType: string;
  fileName: string;
}

@Injectable({ providedIn: 'root' })
export class FilePreviewService {
  private readonly storage = inject(SharexStorageService);
  private readonly cache = new Map<string, PreviewData>();

  /**
   * Detect the preview type from a MIME type string.
   */
  detectType(mimeType: string, fileName = ''): PreviewType {
    const extensionType = this.detectTypeFromExtension(fileName);

    if (!mimeType || mimeType === 'application/octet-stream') return extensionType;

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';

    if (this.isTextMime(mimeType)) return 'text';

    return extensionType;
  }

  /**
   * Check if a file is previewable (not unsupported).
   */
  isPreviewable(mimeType: string, fileName = ''): boolean {
    return this.detectType(mimeType, fileName) !== 'unsupported';
  }

  /**
   * Load preview data for a file. Uses cache to prevent repeated downloads.
   */
  async loadPreview(file: ShareFile): Promise<PreviewData> {
    const cached = this.cache.get(file.id);
    if (cached) return cached;

    const type = this.detectType(file.mime_type, file.file_name);
    const url = this.storage.getPublicUrl(file.storage_path);

    const preview: PreviewData = {
      type,
      url,
      mimeType: file.mime_type,
      fileName: file.file_name
    };

    // For text files, fetch the content
    if (type === 'text') {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          // Cap at 500KB to avoid rendering huge files
          preview.textContent = text.length > 512_000
            ? text.slice(0, 512_000) + '\n\n--- Content truncated (500 KB limit) ---'
            : text;
        }
      } catch {
        preview.textContent = '⚠ Failed to load file content.';
      }
    }

    this.cache.set(file.id, preview);
    return preview;
  }

  /**
   * Clear the cache (e.g., when navigating away).
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Determine the language hint from a file name (for future syntax highlighting).
   */
  detectLanguage(fileName: string): string | null {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return null;
    return FILE_EXTENSION_LANGUAGES[ext] ?? null;
  }

  private isTextMime(mimeType: string): boolean {
    if (mimeType.startsWith('text/')) return true;

    const textMimes = [
      'application/json',
      'application/xml',
      'application/javascript',
      'application/typescript',
      'application/x-sh',
      'application/x-python',
      'application/x-ruby',
      'application/x-perl',
      'application/x-yaml',
      'application/x-toml',
      'application/sql',
      'application/graphql',
      'application/xhtml+xml',
      'application/ld+json'
    ];

    return textMimes.includes(mimeType);
  }

  private detectTypeFromExtension(fileName: string): PreviewType {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return 'unsupported';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) return 'audio';
    if (FILE_EXTENSION_LANGUAGES[ext]) return 'text';

    return 'unsupported';
  }
}

const FILE_EXTENSION_LANGUAGES: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript',
  js: 'javascript', jsx: 'javascript', mjs: 'javascript',
  py: 'python',
  java: 'java',
  rb: 'ruby',
  rs: 'rust',
  go: 'go',
  c: 'c', h: 'c',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
  cs: 'csharp',
  swift: 'swift',
  kt: 'kotlin', kts: 'kotlin',
  dart: 'dart',
  php: 'php',
  html: 'html', htm: 'html',
  css: 'css',
  scss: 'scss', sass: 'scss',
  less: 'less',
  json: 'json',
  xml: 'xml',
  yaml: 'yaml', yml: 'yaml',
  toml: 'toml',
  md: 'markdown',
  sql: 'sql',
  sh: 'bash', bash: 'bash', zsh: 'bash',
  ps1: 'powershell',
  dockerfile: 'dockerfile',
  makefile: 'makefile',
  txt: 'plaintext',
  log: 'plaintext',
  csv: 'csv',
  env: 'plaintext',
  ini: 'ini',
  cfg: 'ini',
  conf: 'plaintext'
};
