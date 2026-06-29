// Audio/Video conversion via ffmpeg.wasm. Lazy-loaded, browser-only.
// NOTE: ffmpeg.wasm runs on the main thread inside our async pipeline.
// For very large files this is slow — surface ETA via progress.

import type { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpegInstance: FFmpeg | null = null;
let loading: Promise<FFmpeg> | null = null;

async function loadFfmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loading) return loading;
  loading = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ff = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    await ff.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpegInstance = ff;
    return ff;
  })();
  return loading;
}

export interface MediaConvertOptions {
  audioBitrateKbps?: number; // e.g. 192
  videoBitrateKbps?: number; // e.g. 2500
  width?: number;
  height?: number;
  fps?: number;
  signal?: AbortSignal;
}

function mimeFor(ext: string): string {
  const m: Record<string, string> = {
    mp3: "audio/mpeg", wav: "audio/wav", flac: "audio/flac", aac: "audio/aac",
    m4a: "audio/mp4", ogg: "audio/ogg", opus: "audio/opus", aiff: "audio/aiff",
    mp4: "video/mp4", webm: "video/webm", mkv: "video/x-matroska", mov: "video/quicktime",
    avi: "video/x-msvideo", gif: "image/gif",
  };
  return m[ext] || "application/octet-stream";
}

export async function convertMedia(
  file: File,
  toExt: string,
  opts: MediaConvertOptions = {},
  onProgress?: (p: number) => void,
): Promise<{ blob: Blob; name: string }> {
  const ff = await loadFfmpeg();
  onProgress?.(5);

  const inName = `in_${Date.now()}.${(file.name.split(".").pop() || "bin").toLowerCase()}`;
  const outName = `out_${Date.now()}.${toExt}`;

  const buf = new Uint8Array(await file.arrayBuffer());
  await ff.writeFile(inName, buf);
  onProgress?.(15);

  const progressHandler = ({ progress }: { progress: number }) => {
    const p = 15 + Math.max(0, Math.min(1, progress)) * 80;
    onProgress?.(Math.round(p));
  };
  ff.on("progress", progressHandler);

  // Build args
  const args: string[] = ["-i", inName];
  const ext = toExt.toLowerCase();

  // Video-targeted
  if (["mp4", "webm", "mkv", "mov", "avi"].includes(ext)) {
    if (opts.width || opts.height) {
      args.push("-vf", `scale=${opts.width || -2}:${opts.height || -2}`);
    }
    if (opts.fps) args.push("-r", String(opts.fps));
    if (ext === "webm") {
      args.push("-c:v", "libvpx-vp9", "-b:v", `${opts.videoBitrateKbps || 2000}k`, "-c:a", "libopus", "-b:a", `${opts.audioBitrateKbps || 128}k`);
    } else if (ext === "mp4" || ext === "mov" || ext === "mkv") {
      args.push("-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-c:a", "aac", "-b:a", `${opts.audioBitrateKbps || 192}k`);
    } else if (ext === "avi") {
      args.push("-c:v", "mpeg4", "-q:v", "5", "-c:a", "libmp3lame", "-b:a", `${opts.audioBitrateKbps || 192}k`);
    }
  } else if (ext === "gif") {
    args.push("-vf", "fps=15,scale=480:-2:flags=lanczos", "-loop", "0");
  } else {
    // Audio-targeted
    args.push("-vn");
    if (ext === "mp3") args.push("-c:a", "libmp3lame", "-b:a", `${opts.audioBitrateKbps || 192}k`);
    else if (ext === "wav") args.push("-c:a", "pcm_s16le");
    else if (ext === "flac") args.push("-c:a", "flac");
    else if (ext === "aac" || ext === "m4a") args.push("-c:a", "aac", "-b:a", `${opts.audioBitrateKbps || 192}k`);
    else if (ext === "ogg") args.push("-c:a", "libvorbis", "-q:a", "5");
    else if (ext === "opus") args.push("-c:a", "libopus", "-b:a", `${opts.audioBitrateKbps || 128}k`);
    else if (ext === "aiff") args.push("-c:a", "pcm_s16be");
  }

  args.push(outName);

  if (opts.signal?.aborted) throw new Error("Canceled");
  opts.signal?.addEventListener("abort", () => { try { ff.terminate(); } catch {} });

  try {
    await ff.exec(args);
  } finally {
    ff.off("progress", progressHandler);
  }

  const data = (await ff.readFile(outName)) as Uint8Array;
  try { await ff.deleteFile(inName); } catch {}
  try { await ff.deleteFile(outName); } catch {}

  onProgress?.(100);
  const base = file.name.replace(/\.[^.]+$/, "");
  // Clone into a fresh ArrayBuffer so the Blob owns its bytes (avoids SharedArrayBuffer issues)
  const out = new Uint8Array(data.byteLength);
  out.set(data);
  return { blob: new Blob([out], { type: mimeFor(ext) }), name: `${base}.${ext}` };
}
