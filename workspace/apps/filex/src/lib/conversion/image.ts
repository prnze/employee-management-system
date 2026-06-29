// Browser image conversion via Canvas + browser-image-compression + heic2any.
// All work happens client-side; no backend.

import imageCompression from "browser-image-compression";

export interface ImageConvertOptions {
  quality?: number; // 0.0 - 1.0
  maxWidth?: number;
  maxHeight?: number;
}

const CANVAS_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  ico: "image/png", // wrap PNG into .ico
};

async function decodeToBitmap(file: File): Promise<{ bitmap: ImageBitmap; width: number; height: number }>
{
  const ext = (file.name.split(".").pop() || "").toLowerCase();

  // HEIC/HEIF → decode via heic2any → PNG blob, then bitmap
  if (ext === "heic" || ext === "heif") {
    const heic2any = (await import("heic2any")).default;
    const out = (await heic2any({ blob: file, toType: "image/png", quality: 1 })) as Blob;
    const bitmap = await createImageBitmap(out);
    return { bitmap, width: bitmap.width, height: bitmap.height };
  }

  // SVG → render via Image element to preserve vector at chosen size
  if (ext === "svg") {
    const text = await file.text();
    const svgBlob = new Blob([text], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      await img.decode();
      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const bitmap = await createImageBitmap(canvas);
      return { bitmap, width: w, height: h };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const bitmap = await createImageBitmap(file);
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

export async function convertImage(
  file: File,
  toExt: string,
  opts: ImageConvertOptions = {},
  onProgress?: (p: number) => void,
): Promise<{ blob: Blob; name: string }>
{
  const targetExt = toExt.toLowerCase();
  const mime = CANVAS_MIME[targetExt];
  if (!mime) throw new Error(`Unsupported target format: ${toExt}`);

  onProgress?.(5);
  const { bitmap, width, height } = await decodeToBitmap(file);
  onProgress?.(35);

  // Optional resize
  let w = width;
  let h = height;
  if (opts.maxWidth && w > opts.maxWidth) {
    const r = opts.maxWidth / w;
    w = opts.maxWidth; h = Math.round(h * r);
  }
  if (opts.maxHeight && h > opts.maxHeight) {
    const r = opts.maxHeight / h;
    h = opts.maxHeight; w = Math.round(w * r);
  }

  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  // PNG/WEBP/AVIF preserve alpha; JPG/BMP need a white background
  if (["jpg", "jpeg", "bmp"].includes(targetExt)) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  onProgress?.(65);

  const quality = typeof opts.quality === "number" ? opts.quality : 0.92;
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error(`Canvas could not encode ${mime}. Browser may not support this format.`))),
      mime,
      quality,
    );
  });
  onProgress?.(90);

  // Optional second-pass compression for jpeg/webp/png to honor quality target
  let finalBlob = blob;
  if (["jpeg", "webp", "png"].includes(mime.split("/")[1])) {
    try {
      const compressed = await imageCompression(new File([blob], `tmp.${targetExt}`, { type: mime }), {
        maxSizeMB: 50,
        useWebWorker: true,
        initialQuality: quality,
        fileType: mime as any,
      });
      if (compressed.size < blob.size) finalBlob = compressed;
    } catch {/* keep canvas output */}
  }

  onProgress?.(100);
  const base = file.name.replace(/\.[^.]+$/, "");
  return { blob: finalBlob, name: `${base}.${targetExt}` };
}
