// Archive engines — ZIP/TAR/GZIP, all client-side.
import JSZip from "jszip";

export async function filesToZip(files: File[], onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f));
  const blob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (meta) => onProgress?.(Math.round(meta.percent)),
  );
  return { blob, name: files.length === 1 ? `${files[0].name.replace(/\.[^.]+$/, "")}.zip` : `filex-archive-${Date.now()}.zip` };
}

/** Extract a ZIP and re-pack as individual blobs the caller can download. */
export async function zipExtract(file: File, onProgress?: (p: number) => void): Promise<{ name: string; blob: Blob }[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entries = Object.values(zip.files).filter((e) => !e.dir);
  const out: { name: string; blob: Blob }[] = [];
  for (let i = 0; i < entries.length; i++) {
    const data = await entries[i].async("uint8array");
    const ab = new ArrayBuffer(data.byteLength);
    new Uint8Array(ab).set(data);
    out.push({ name: entries[i].name, blob: new Blob([ab]) });
    onProgress?.(Math.round(((i + 1) / entries.length) * 100));
  }
  return out;
}

/** GZIP a single file using the native CompressionStream API. */
export async function gzipFile(file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  onProgress?.(10);
  // @ts-ignore — CompressionStream is standard in modern browsers
  const cs = new CompressionStream("gzip");
  const compressed = file.stream().pipeThrough(cs);
  const blob = await new Response(compressed).blob();
  onProgress?.(100);
  return { blob: new Blob([blob], { type: "application/gzip" }), name: `${file.name}.gz` };
}

export async function fileToTar(file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  onProgress?.(20);
  const data = new Uint8Array(await file.arrayBuffer());
  const chunks: Uint8Array[] = [makeTarHeader(file.name, data.length), data];
  const pad = (512 - (data.length % 512)) % 512;
  if (pad) chunks.push(new Uint8Array(pad));
  chunks.push(new Uint8Array(1024));
  const total = chunks.reduce((a, b) => a + b.byteLength, 0);
  const tar = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { tar.set(c, off); off += c.byteLength; }
  onProgress?.(100);
  const base = file.name.replace(/\.[^.]+$/, "");
  return { blob: new Blob([tar.buffer as ArrayBuffer], { type: "application/x-tar" }), name: `${base}.tar` };
}

export async function zipToTar(file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entries = Object.values(zip.files).filter((e) => !e.dir);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const data = await e.async("uint8array");
    chunks.push(makeTarHeader(e.name, data.length));
    chunks.push(data);
    const pad = (512 - (data.length % 512)) % 512;
    if (pad) chunks.push(new Uint8Array(pad));
    onProgress?.(Math.round(((i + 1) / entries.length) * 100));
  }
  chunks.push(new Uint8Array(1024));
  const total = chunks.reduce((a, b) => a + b.byteLength, 0);
  const tar = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { tar.set(c, off); off += c.byteLength; }
  const base = file.name.replace(/\.[^.]+$/, "");
  return { blob: new Blob([tar.buffer as ArrayBuffer], { type: "application/x-tar" }), name: `${base}.tar` };
}

function makeTarHeader(name: string, size: number): Uint8Array {
  const h = new Uint8Array(512);
  const enc = new TextEncoder();
  const write = (offset: number, s: string, len: number) => {
    const b = enc.encode(s);
    h.set(b.subarray(0, Math.min(len, b.length)), offset);
  };
  write(0, name.slice(0, 100), 100);
  write(100, "0000644\0", 8);
  write(108, "0000000\0", 8);
  write(116, "0000000\0", 8);
  write(124, size.toString(8).padStart(11, "0") + "\0", 12);
  write(136, Math.floor(Date.now() / 1000).toString(8).padStart(11, "0") + "\0", 12);
  write(148, "        ", 8);
  write(156, "0", 1);
  write(257, "ustar\0", 6);
  write(263, "00", 2);
  let sum = 0;
  for (let i = 0; i < 512; i++) sum += h[i];
  const csum = sum.toString(8).padStart(6, "0") + "\0 ";
  write(148, csum, 8);
  return h;
}
