export interface Share {
  id: string;
  share_code: string;
  title: string | null;
  content: string | null;
  content_type: ContentType;
  language: string | null;
  password_hash: string | null;
  expiry_at: string | null;
  view_limit: number | null;
  view_count: number;
  download_count: number;
  is_burn_after_read: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  share_files?: ShareFile[];
}

export interface ShareFile {
  id: string;
  share_id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  size: number;
  created_at: string;
}

export type ContentType = 'text' | 'code' | 'markdown' | 'json';

export type ExpiryOption = '10m' | '1h' | '1d' | '7d' | '30d' | 'never' | 'custom';

export interface CreateSharePayload {
  title?: string;
  content?: string;
  content_type?: ContentType;
  language?: string;
  password?: string;
  expiry_option: ExpiryOption;
  custom_expiry_at?: string;
  view_limit?: number;
  is_burn_after_read?: boolean;
}

export const EXPIRY_OPTIONS: { value: ExpiryOption; label: string; description: string }[] = [
  { value: '10m', label: '10 min', description: 'Expires in 10 minutes' },
  { value: '1h', label: '1 hour', description: 'Expires in 1 hour' },
  { value: '1d', label: '1 day', description: 'Expires in 24 hours' },
  { value: '7d', label: '7 days', description: 'Expires in 7 days' },
  { value: '30d', label: '30 days', description: 'Expires in 30 days' },
  { value: 'never', label: 'Never', description: 'Never expires' },
  { value: 'custom', label: 'Custom', description: 'Pick a specific date and time' }
];

export const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: 'text', label: 'Plain Text', icon: 'description' },
  { value: 'code', label: 'Code', icon: 'code' },
  { value: 'markdown', label: 'Markdown', icon: 'edit_note' },
  { value: 'json', label: 'JSON', icon: 'data_object' }
];

export const CODE_LANGUAGES: string[] = [
  'typescript', 'javascript', 'python', 'java', 'html', 'css', 'scss',
  'json', 'sql', 'bash', 'rust', 'go', 'c', 'cpp', 'csharp', 'ruby',
  'php', 'swift', 'kotlin', 'dart', 'yaml', 'xml', 'markdown', 'plaintext'
];

export function expiryToDate(option: ExpiryOption, customDate?: string): string | null {
  if (option === 'never') return null;
  if (option === 'custom') return customDate ? new Date(customDate).toISOString() : null;
  const durations: Record<string, number> = {
    '10m': 10 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  return new Date(Date.now() + durations[option]).toISOString();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'movie';
  if (mimeType.startsWith('audio/')) return 'audio_file';
  if (mimeType === 'application/pdf') return 'picture_as_pdf';
  if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('compressed')) return 'folder_zip';
  if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) return 'table_chart';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'article';
  return 'insert_drive_file';
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function timeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 'expired';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
