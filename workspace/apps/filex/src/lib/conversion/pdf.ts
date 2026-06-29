// PDF + lightweight document conversions, all client-side.
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

// ---------- Text → PDF ----------
export async function textToPdf(file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  onProgress?.(10);
  const text = await file.text();
  onProgress?.(35);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Courier);
  const size = 11;
  const margin = 48;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxCharsPerLine = 95;

  const lines: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    if (para.length === 0) { lines.push(""); continue; }
    for (let i = 0; i < para.length; i += maxCharsPerLine) lines.push(para.slice(i, i + maxCharsPerLine));
  }

  const lineHeight = size * 1.4;
  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  let cursor = 0;
  while (cursor < lines.length) {
    const page = pdf.addPage([pageWidth, pageHeight]);
    const slice = lines.slice(cursor, cursor + linesPerPage);
    slice.forEach((ln, i) => {
      page.drawText(ln, { x: margin, y: pageHeight - margin - i * lineHeight - size, size, font, color: rgb(0.1, 0.1, 0.1) });
    });
    cursor += linesPerPage;
    onProgress?.(35 + Math.round((cursor / lines.length) * 55));
  }

  const bytes = await pdf.save();
  onProgress?.(100);
  const base = file.name.replace(/\.[^.]+$/, "");
  return { blob: toPdfBlob(bytes), name: `${base}.pdf` };
}

// ---------- pdfjs-dist lazy loader (browser only) ----------
async function loadPdfJs() {
  // @ts-ignore — pdfjs-dist worker URL
  const pdfjsLib: any = await import("pdfjs-dist/build/pdf.mjs");
  // @ts-ignore
  const workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  return pdfjsLib;
}

// ---------- PDF → text (pdfjs-powered) ----------
export async function pdfToText(file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  onProgress?.(10);
  try {
    const pdfjs = await loadPdfJs();
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const out: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((it: any) => it.str).join(" ");
      out.push(`--- Page ${i} ---\n${text}`);
      onProgress?.(10 + Math.round((i / doc.numPages) * 85));
    }
    onProgress?.(100);
    const base = file.name.replace(/\.[^.]+$/, "");
    return { blob: new Blob([out.join("\n\n")], { type: "text/plain" }), name: `${base}.txt` };
  } catch (e: any) {
    const base = file.name.replace(/\.[^.]+$/, "");
    return {
      blob: new Blob([`[FileX: failed to extract text — ${e?.message || e}. Scanned PDFs need OCR (FileX Pro backend).]`], { type: "text/plain" }),
      name: `${base}.txt`,
    };
  }
}

// ---------- Light textual conversions ----------
export async function textLikeConvert(file: File, toExt: string, onProgress?: (p: number) => void): Promise<{ blob: Blob; name: string }> {
  onProgress?.(20);
  const src = await file.text();
  let out = src;
  const fromExt = (file.name.split(".").pop() || "").toLowerCase();
  if (toExt === "md" && fromExt === "html") {
    out = src.replace(/<\/?[^>]+>/g, "").replace(/\n{3,}/g, "\n\n");
  } else if (toExt === "html" && (fromExt === "md" || fromExt === "txt")) {
    const esc = src.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
    out = `<!doctype html><html><head><meta charset="utf-8"><title>${file.name}</title></head><body><pre>${esc}</pre></body></html>`;
  } else if (toExt === "csv" && fromExt === "txt") {
    out = src.split(/\r?\n/).map((l) => l.split(/\t|\s{2,}/).map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  }
  onProgress?.(100);
  const base = file.name.replace(/\.[^.]+$/, "");
  return { blob: new Blob([out], { type: "text/plain" }), name: `${base}.${toExt}` };
}

// ---------- PDF tools ----------
function toPdfBlob(bytes: Uint8Array): Blob {
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return new Blob([ab], { type: "application/pdf" });
}

export async function mergePdfs(files: File[], onProgress?: (p: number) => void): Promise<Blob> {
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const src = await PDFDocument.load(await files[i].arrayBuffer());
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    onProgress?.(Math.round(((i + 1) / files.length) * 100));
  }
  return toPdfBlob(await out.save());
}

/** Parse "1-3,5,8-10" into 0-based indices clamped to pageCount */
export function parsePageRange(range: string, pageCount: number): number[] {
  const out = new Set<number>();
  for (const part of range.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    const lo = Math.max(1, Math.min(a, b));
    const hi = Math.min(pageCount, Math.max(a, b));
    for (let i = lo; i <= hi; i++) out.add(i - 1);
  }
  return [...out].sort((x, y) => x - y);
}

export async function splitPdf(file: File, range: string): Promise<Blob> {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const idx = parsePageRange(range, src.getPageCount());
  if (idx.length === 0) throw new Error("No pages selected for the given range.");
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, idx);
  pages.forEach((p) => out.addPage(p));
  return toPdfBlob(await out.save());
}

export async function rotatePdf(file: File, angle: 90 | 180 | 270, range?: string): Promise<Blob> {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const targets = range ? parsePageRange(range, src.getPageCount()) : src.getPageIndices();
  targets.forEach((i) => {
    const p = src.getPage(i);
    const current = p.getRotation().angle;
    p.setRotation(degrees((current + angle) % 360));
  });
  return toPdfBlob(await src.save());
}

/** Rasterize each PDF page to PNG via pdfjs + canvas. */
export async function pdfExtractImages(file: File, onProgress?: (p: number) => void): Promise<Blob[]> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const out: Blob[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), "image/png"));
    out.push(blob);
    onProgress?.(Math.round((i / doc.numPages) * 100));
  }
  return out;
}

export async function pdfPageCount(file: File): Promise<number> {
  const doc = await PDFDocument.load(await file.arrayBuffer());
  return doc.getPageCount();
}
