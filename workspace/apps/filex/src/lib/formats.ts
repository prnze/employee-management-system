import type { Category } from "./store";

export interface FormatDef {
  ext: string;
  label: string;
  category: Category;
  mime?: string;
  supported: boolean; // can we convert TO this in browser?
  description: string;
}

export const FORMATS: FormatDef[] = [
  // Images — supported via Canvas / browser-image-compression / heic2any
  { ext: "jpg", label: "JPG", category: "image", mime: "image/jpeg", supported: true, description: "JPEG photo — lossy, ubiquitous." },
  { ext: "jpeg", label: "JPEG", category: "image", mime: "image/jpeg", supported: true, description: "Same as JPG." },
  { ext: "png", label: "PNG", category: "image", mime: "image/png", supported: true, description: "Lossless raster with alpha." },
  { ext: "webp", label: "WEBP", category: "image", mime: "image/webp", supported: true, description: "Modern lossy/lossless web format." },
  { ext: "avif", label: "AVIF", category: "image", mime: "image/avif", supported: true, description: "Next-gen AV1-based image. Best compression." },
  { ext: "gif", label: "GIF", category: "image", mime: "image/gif", supported: true, description: "Animated bitmap (single frame on encode)." },
  { ext: "bmp", label: "BMP", category: "image", mime: "image/bmp", supported: true, description: "Uncompressed bitmap." },
  { ext: "heic", label: "HEIC", category: "image", mime: "image/heic", supported: false, description: "Apple HEIF. Decoded from, not encoded to." },
  { ext: "heif", label: "HEIF", category: "image", mime: "image/heif", supported: false, description: "High Efficiency Image. Decoded only." },
  { ext: "tiff", label: "TIFF", category: "image", mime: "image/tiff", supported: false, description: "Multi-page raster. Backend required." },
  { ext: "svg", label: "SVG", category: "image", mime: "image/svg+xml", supported: true, description: "Vector. Rasterized when converting to bitmaps." },
  { ext: "ico", label: "ICO", category: "image", mime: "image/x-icon", supported: true, description: "Windows icon (single-size PNG inside)." },
  // RAW / pro
  { ext: "cr2", label: "CR2", category: "image", supported: false, description: "Canon RAW. Backend required." },
  { ext: "nef", label: "NEF", category: "image", supported: false, description: "Nikon RAW. Backend required." },
  { ext: "arw", label: "ARW", category: "image", supported: false, description: "Sony RAW. Backend required." },
  { ext: "dng", label: "DNG", category: "image", supported: false, description: "Adobe Digital Negative. Backend required." },
  { ext: "psd", label: "PSD", category: "image", supported: false, description: "Photoshop. Backend required." },

  // Audio
  { ext: "mp3", label: "MP3", category: "audio", mime: "audio/mpeg", supported: true, description: "Lossy MP3." },
  { ext: "wav", label: "WAV", category: "audio", mime: "audio/wav", supported: true, description: "Lossless PCM." },
  { ext: "flac", label: "FLAC", category: "audio", mime: "audio/flac", supported: true, description: "Free lossless audio." },
  { ext: "aac", label: "AAC", category: "audio", mime: "audio/aac", supported: true, description: "Advanced Audio Coding." },
  { ext: "m4a", label: "M4A", category: "audio", mime: "audio/mp4", supported: true, description: "AAC in MP4 container." },
  { ext: "ogg", label: "OGG", category: "audio", mime: "audio/ogg", supported: true, description: "Vorbis in Ogg." },
  { ext: "opus", label: "OPUS", category: "audio", mime: "audio/opus", supported: true, description: "Low-latency, high quality." },
  { ext: "aiff", label: "AIFF", category: "audio", mime: "audio/aiff", supported: true, description: "Apple lossless interchange." },
  { ext: "wma", label: "WMA", category: "audio", supported: false, description: "Windows Media. Decoded only." },

  // Video
  { ext: "mp4", label: "MP4", category: "video", mime: "video/mp4", supported: true, description: "H.264/AAC MP4. Most compatible." },
  { ext: "webm", label: "WEBM", category: "video", mime: "video/webm", supported: true, description: "VP9/Opus WebM." },
  { ext: "mkv", label: "MKV", category: "video", mime: "video/x-matroska", supported: true, description: "Matroska container." },
  { ext: "mov", label: "MOV", category: "video", mime: "video/quicktime", supported: true, description: "QuickTime container." },
  { ext: "avi", label: "AVI", category: "video", mime: "video/x-msvideo", supported: true, description: "Legacy AVI." },
  { ext: "gif", label: "GIF (anim)", category: "video", mime: "image/gif", supported: true, description: "Animated GIF from video." },

  // PDF / docs
  { ext: "pdf", label: "PDF", category: "pdf", mime: "application/pdf", supported: true, description: "Portable Document Format." },
  { ext: "txt", label: "TXT", category: "pdf", mime: "text/plain", supported: true, description: "Plain text." },
  { ext: "md", label: "MD", category: "pdf", mime: "text/markdown", supported: true, description: "Markdown." },
  { ext: "html", label: "HTML", category: "pdf", mime: "text/html", supported: true, description: "HTML document." },
  { ext: "csv", label: "CSV", category: "pdf", mime: "text/csv", supported: true, description: "Comma-separated values." },
  { ext: "docx", label: "DOCX", category: "pdf", supported: false, description: "Word document. Backend required for fidelity." },

  // Archives
  { ext: "zip", label: "ZIP", category: "archive", mime: "application/zip", supported: true, description: "ZIP archive." },
  { ext: "tar", label: "TAR", category: "archive", mime: "application/x-tar", supported: true, description: "TAR archive (uncompressed)." },
  { ext: "gz", label: "GZIP", category: "archive", mime: "application/gzip", supported: true, description: "GZIP-compressed single file." },
  { ext: "rar", label: "RAR", category: "archive", supported: false, description: "Proprietary RAR. Backend required." },
  { ext: "7z", label: "7Z", category: "archive", supported: false, description: "7-Zip. Backend required." },
];


export function getExt(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

export function categoryOf(ext: string): Category {
  const f = FORMATS.find((x) => x.ext === ext.toLowerCase());
  if (f) return f.category;
  if (["mp3", "wav", "flac", "aac", "m4a", "ogg", "opus", "aiff", "wma"].includes(ext)) return "audio";
  if (["mp4", "webm", "mkv", "mov", "avi", "wmv", "flv", "mpeg", "mpg", "3gp", "m4v"].includes(ext)) return "video";
  if (["pdf", "txt", "md", "html", "csv", "docx", "doc", "rtf"].includes(ext)) return "pdf";
  if (["zip", "tar", "gz", "rar", "7z", "bz2"].includes(ext)) return "archive";
  if (["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "heic", "heif", "tiff", "svg", "ico"].includes(ext)) return "image";
  return "unsupported";
}

export function targetsFor(fromExt: string): FormatDef[] {
  const cat = categoryOf(fromExt);
  if (cat === "unsupported") return [];
  return FORMATS.filter((f) => f.category === cat && f.ext !== fromExt);
}

export function formatBytes(n: number): string {
  if (!n && n !== 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}
