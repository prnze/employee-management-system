// Lightweight metadata extraction + estimate engine — all runs on-device.
import type { Job, Category } from "./store";

export interface MediaInfo {
  width?: number;
  height?: number;
  aspect?: string;
  duration?: number; // seconds
  bitrateKbps?: number;
  sampleRate?: number;
  channels?: number;
  hasAlpha?: boolean;
  frames?: number;
  pages?: number;
  transparency?: boolean;
  fps?: number;
}

export interface Estimate {
  outBytes: number;
  ratio: number; // 0..1 (output / input)
  savedPct: number; // 0..100
  qualityLabel: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor";
  qualityPct: number;
  qualityLossPct: number;
  etaSec: number;
  cpu: "Low" | "Moderate" | "Heavy";
  memory: "Low" | "Moderate" | "Heavy";
}

export async function inspectFile(file: File, category: Category): Promise<MediaInfo> {
  const info: MediaInfo = {};
  try {
    if (category === "image") {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("decode"));
        img.src = url;
      });
      info.width = img.naturalWidth;
      info.height = img.naturalHeight;
      info.aspect = gcdAspect(img.naturalWidth, img.naturalHeight);
      info.transparency = /png|webp|avif|gif|svg/i.test(file.type) || file.name.toLowerCase().match(/\.(png|webp|avif|gif|svg)$/) !== null;
      URL.revokeObjectURL(url);
    } else if (category === "audio" || category === "video") {
      const el = document.createElement(category === "audio" ? "audio" : "video") as HTMLMediaElement;
      el.preload = "metadata";
      const url = URL.createObjectURL(file);
      el.src = url;
      await new Promise<void>((res) => {
        el.onloadedmetadata = () => res();
        el.onerror = () => res();
        setTimeout(res, 4000);
      });
      info.duration = isFinite(el.duration) ? el.duration : undefined;
      if (category === "video") {
        const v = el as HTMLVideoElement;
        info.width = v.videoWidth;
        info.height = v.videoHeight;
        info.aspect = gcdAspect(v.videoWidth, v.videoHeight);
      }
      if (info.duration) info.bitrateKbps = Math.round((file.size * 8) / info.duration / 1000);
      URL.revokeObjectURL(url);
    }
  } catch {
    /* ignore */
  }
  return info;
}

function gcdAspect(w: number, h: number): string {
  if (!w || !h) return "—";
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const d = g(w, h);
  return `${w / d}:${h / d}`;
}

// Heuristic estimator. Not a guarantee — purely indicative.
export function estimateConversion(job: Job, info: MediaInfo): Estimate {
  const opts = (job.options || {}) as Record<string, any>;
  const from = job.fromExt.toLowerCase();
  const to = job.toExt.toLowerCase();
  let ratio = 1;

  if (job.category === "image") {
    const q = opts.quality ?? 0.9;
    const formatRatio: Record<string, number> = {
      avif: 0.25, webp: 0.35, jpg: 0.45, jpeg: 0.45, png: 1.1, bmp: 3.5, gif: 0.9, ico: 0.6,
    };
    ratio = (formatRatio[to] ?? 0.6) * (q + 0.3);
    if (opts.maxWidth && info.width && info.width > opts.maxWidth) {
      const s = opts.maxWidth / info.width;
      ratio *= s * s;
    }
  } else if (job.category === "audio") {
    const targetKbps = opts.audioBitrateKbps ?? (to === "flac" || to === "wav" ? 1000 : 192);
    const srcKbps = info.bitrateKbps ?? 256;
    ratio = targetKbps / srcKbps;
    if (to === "flac") ratio = 0.55;
    if (to === "wav") ratio = (info.duration ?? 60) * 176400 / job.fileSize;
  } else if (job.category === "video") {
    const v = opts.videoBitrateKbps ?? 2500;
    const a = opts.audioBitrateKbps ?? 128;
    if (info.duration) {
      ratio = ((v + a) * 1000 * info.duration / 8) / job.fileSize;
    } else {
      ratio = 0.6;
    }
  } else if (job.category === "pdf") {
    ratio = to === "txt" ? 0.05 : 0.9;
  } else if (job.category === "archive") {
    ratio = to === "tar" ? 1.02 : 0.7;
  }

  ratio = Math.max(0.02, Math.min(4, ratio));
  const outBytes = Math.round(job.fileSize * ratio);
  const savedPct = Math.max(0, Math.round((1 - ratio) * 100));

  // Quality estimate
  let qp = 100;
  if (job.category === "image") qp = Math.round(((opts.quality ?? 0.9) * 0.85 + 0.15) * 100);
  if (to === "png" || to === "flac" || to === "wav" || to === "tar") qp = 100;
  if (job.category === "audio") {
    const kbps = opts.audioBitrateKbps ?? 192;
    qp = Math.min(100, Math.round((kbps / 320) * 100 + 10));
  }
  if (job.category === "video") {
    const v = opts.videoBitrateKbps ?? 2500;
    qp = Math.min(100, Math.round((v / 8000) * 80 + 20));
  }
  const qLossPct = Math.max(0, 100 - qp);

  const qualityLabel: Estimate["qualityLabel"] =
    qp >= 95 ? "Excellent" : qp >= 85 ? "Very Good" : qp >= 70 ? "Good" : qp >= 55 ? "Fair" : "Poor";

  // ETA — rough
  let etaSec = 1;
  if (job.category === "image") etaSec = Math.max(1, Math.round(job.fileSize / 4_000_000));
  if (job.category === "audio") etaSec = Math.max(2, Math.round((info.duration ?? 60) * 0.08));
  if (job.category === "video") etaSec = Math.max(5, Math.round((info.duration ?? 30) * 0.9));
  if (job.category === "pdf") etaSec = Math.max(1, Math.round(job.fileSize / 6_000_000));
  if (job.category === "archive") etaSec = Math.max(1, Math.round(job.fileSize / 12_000_000));

  const cpu: Estimate["cpu"] = job.category === "video" ? "Heavy" : job.category === "audio" ? "Moderate" : "Low";
  const memory: Estimate["memory"] = job.fileSize > 200_000_000 ? "Heavy" : job.fileSize > 50_000_000 ? "Moderate" : "Low";

  return { outBytes, ratio, savedPct, qualityLabel, qualityPct: qp, qualityLossPct: qLossPct, etaSec, cpu, memory };
}

export interface Recommendation {
  to: string;
  reason: string;
  expectedReductionPct: number;
  expectedQualityPct: number;
}

export function recommendTarget(job: Job): Recommendation | null {
  const from = job.fromExt.toLowerCase();
  if (job.category === "image") {
    if (["heic", "heif"].includes(from)) return { to: "avif", reason: "AVIF preserves Apple HEIC quality while shrinking dramatically.", expectedReductionPct: 60, expectedQualityPct: 97 };
    if (["png", "bmp", "tiff"].includes(from)) return { to: "webp", reason: "WebP lossless/near-lossless is a fraction of PNG size.", expectedReductionPct: 70, expectedQualityPct: 98 };
    if (["jpg", "jpeg"].includes(from)) return { to: "avif", reason: "AVIF beats JPG by ~50% at matching quality.", expectedReductionPct: 50, expectedQualityPct: 96 };
  }
  if (job.category === "audio") {
    if (["wav", "aiff"].includes(from)) return { to: "flac", reason: "FLAC is lossless and ~50% smaller than WAV.", expectedReductionPct: 50, expectedQualityPct: 100 };
    if (from === "mp3") return { to: "opus", reason: "Opus matches MP3 quality at half the bitrate.", expectedReductionPct: 45, expectedQualityPct: 95 };
  }
  if (job.category === "video") {
    if (["mov", "avi", "mkv"].includes(from)) return { to: "mp4", reason: "MP4/H.264 is the most compatible delivery format.", expectedReductionPct: 50, expectedQualityPct: 95 };
    if (from === "mp4") return { to: "webm", reason: "WebM/VP9 saves space for web playback.", expectedReductionPct: 30, expectedQualityPct: 94 };
  }
  if (job.category === "pdf" && from === "pdf") return { to: "txt", reason: "Extract plain text for search & indexing.", expectedReductionPct: 95, expectedQualityPct: 100 };
  return null;
}
