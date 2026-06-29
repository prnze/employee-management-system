// Conversion presets tuned for common platforms / use cases.
import type { Category } from "./store";

export interface Preset {
  id: string;
  name: string;
  description: string;
  to: string;
  options: Record<string, any>;
}

export const PRESETS: Record<Category, Preset[]> = {
  image: [
    { id: "instagram", name: "Instagram", description: "1080×1080 JPG · 90%", to: "jpg", options: { quality: 0.9, maxWidth: 1080, maxHeight: 1080 } },
    { id: "ig-story", name: "Instagram Story", description: "1080×1920 JPG", to: "jpg", options: { quality: 0.9, maxWidth: 1080, maxHeight: 1920 } },
    { id: "facebook", name: "Facebook", description: "2048px WEBP", to: "webp", options: { quality: 0.88, maxWidth: 2048 } },
    { id: "whatsapp", name: "WhatsApp", description: "1600px JPG · 80%", to: "jpg", options: { quality: 0.8, maxWidth: 1600 } },
    { id: "telegram", name: "Telegram", description: "2560px JPG · 88%", to: "jpg", options: { quality: 0.88, maxWidth: 2560 } },
    { id: "discord", name: "Discord", description: "1920px WEBP", to: "webp", options: { quality: 0.85, maxWidth: 1920 } },
    { id: "twitter", name: "Twitter / X", description: "2048px JPG · 85%", to: "jpg", options: { quality: 0.85, maxWidth: 2048 } },
    { id: "reddit", name: "Reddit", description: "1920px PNG", to: "png", options: { maxWidth: 1920 } },
    { id: "web", name: "Web Optimized", description: "1920px AVIF · 80%", to: "avif", options: { quality: 0.8, maxWidth: 1920 } },
    { id: "email", name: "Email Attachment", description: "1280px JPG · 75%", to: "jpg", options: { quality: 0.75, maxWidth: 1280 } },
    { id: "archive", name: "Archive Quality", description: "PNG lossless", to: "png", options: {} },
    { id: "print", name: "Print Quality", description: "JPG · 98%", to: "jpg", options: { quality: 0.98 } },
    { id: "pro", name: "Professional Photography", description: "PNG, no resize", to: "png", options: {} },
  ],
  audio: [
    { id: "spotify", name: "Spotify", description: "OGG · 320 kbps", to: "ogg", options: { audioBitrateKbps: 320 } },
    { id: "apple", name: "Apple Music", description: "AAC · 256 kbps", to: "aac", options: { audioBitrateKbps: 256 } },
    { id: "ytmusic", name: "YouTube Music", description: "AAC · 256 kbps", to: "aac", options: { audioBitrateKbps: 256 } },
    { id: "podcast", name: "Podcast", description: "MP3 · 128 kbps", to: "mp3", options: { audioBitrateKbps: 128 } },
    { id: "voice", name: "Voice Recording", description: "OPUS · 64 kbps", to: "opus", options: { audioBitrateKbps: 64 } },
    { id: "audiobook", name: "Audiobook", description: "M4A · 96 kbps", to: "m4a", options: { audioBitrateKbps: 96 } },
    { id: "archive", name: "Archive Quality", description: "FLAC lossless", to: "flac", options: {} },
    { id: "broadcast", name: "Broadcast", description: "WAV PCM", to: "wav", options: {} },
    { id: "pro", name: "Professional Audio", description: "FLAC lossless", to: "flac", options: {} },
  ],
  video: [
    { id: "youtube", name: "YouTube", description: "1080p MP4 · 8 Mbps", to: "mp4", options: { videoBitrateKbps: 8000, audioBitrateKbps: 192, height: 1080 } },
    { id: "yt-shorts", name: "YouTube Shorts", description: "1080×1920 MP4", to: "mp4", options: { videoBitrateKbps: 6000, audioBitrateKbps: 192, width: 1080, height: 1920 } },
    { id: "reel", name: "Instagram Reel", description: "1080×1920 MP4", to: "mp4", options: { videoBitrateKbps: 5000, audioBitrateKbps: 128, width: 1080, height: 1920 } },
    { id: "tiktok", name: "TikTok", description: "1080×1920 MP4", to: "mp4", options: { videoBitrateKbps: 5000, audioBitrateKbps: 128, width: 1080, height: 1920 } },
    { id: "whatsapp", name: "WhatsApp", description: "720p MP4 · low", to: "mp4", options: { videoBitrateKbps: 1500, audioBitrateKbps: 96, height: 720 } },
    { id: "telegram", name: "Telegram", description: "720p MP4", to: "mp4", options: { videoBitrateKbps: 2500, audioBitrateKbps: 128, height: 720 } },
    { id: "discord", name: "Discord", description: "720p MP4 · 8 MB cap", to: "mp4", options: { videoBitrateKbps: 1000, audioBitrateKbps: 96, height: 720 } },
    { id: "4k", name: "4K Archive", description: "2160p MP4 · 25 Mbps", to: "mp4", options: { videoBitrateKbps: 25000, audioBitrateKbps: 256, height: 2160 } },
    { id: "stream", name: "Streaming", description: "1080p MP4 · 6 Mbps", to: "mp4", options: { videoBitrateKbps: 6000, audioBitrateKbps: 192, height: 1080 } },
    { id: "present", name: "Presentation", description: "720p MP4 · 2 Mbps", to: "mp4", options: { videoBitrateKbps: 2000, audioBitrateKbps: 128, height: 720 } },
    { id: "email", name: "Email Attachment", description: "480p MP4 · 800 kbps", to: "mp4", options: { videoBitrateKbps: 800, audioBitrateKbps: 96, height: 480 } },
    { id: "pro", name: "Professional Editing", description: "MOV high bitrate", to: "mov", options: { videoBitrateKbps: 20000, audioBitrateKbps: 320 } },
  ],
  pdf: [
    { id: "email", name: "Email", description: "PDF small", to: "pdf", options: {} },
    { id: "print", name: "Print", description: "PDF high quality", to: "pdf", options: {} },
    { id: "archive", name: "Archive", description: "PDF/A-like", to: "pdf", options: {} },
    { id: "compress", name: "High Compression", description: "PDF compact", to: "pdf", options: {} },
    { id: "ocr", name: "OCR Ready", description: "TXT (Pro for OCR)", to: "txt", options: {} },
    { id: "publish", name: "Publishing", description: "PDF print-ready", to: "pdf", options: {} },
  ],
  archive: [
    { id: "zip", name: "ZIP", description: "Standard ZIP", to: "zip", options: {} },
    { id: "tar", name: "TAR", description: "Uncompressed TAR", to: "tar", options: {} },
    { id: "gz", name: "GZIP", description: "Single-file gzip", to: "gz", options: {} },
  ],
  unsupported: [],
};
