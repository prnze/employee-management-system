import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FileText, RotateCw, Scissors, Combine, ImageDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { mergePdfs, splitPdf, rotatePdf, pdfExtractImages, pdfPageCount } from "@/lib/conversion/pdf";
import { InfoTip } from "./InfoTip";

type Mode = "merge" | "split" | "rotate" | "images";

export function PdfTools() {
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-");
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [busy, setBusy] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const onDrop = useCallback(async (incoming: File[]) => {
    const pdfs = incoming.filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) {
      toast.error("Only PDF files supported here.");
      return;
    }
    setFiles(pdfs);
    if (pdfs[0]) {
      try {
        const n = await pdfPageCount(pdfs[0]);
        setPageCount(n);
        if (mode === "split" && range === "1-") setRange(`1-${n}`);
      } catch {}
    }
  }, [mode, range]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"] } });

  const download = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const run = async () => {
    if (!files.length) { toast.error("Drop a PDF first."); return; }
    setBusy(true);
    try {
      if (mode === "merge") {
        if (files.length < 2) throw new Error("Drop at least 2 PDFs to merge.");
        const blob = await mergePdfs(files);
        download(blob, `merged-${Date.now()}.pdf`);
      } else if (mode === "split") {
        const blob = await splitPdf(files[0], range);
        download(blob, files[0].name.replace(/\.pdf$/i, `.pages-${range.replace(/[^\d-]/g, "_")}.pdf`));
      } else if (mode === "rotate") {
        const blob = await rotatePdf(files[0], angle);
        download(blob, files[0].name.replace(/\.pdf$/i, `.rot${angle}.pdf`));
      } else if (mode === "images") {
        const imgs = await pdfExtractImages(files[0]);
        const zip = new JSZip();
        imgs.forEach((b, i) => zip.file(`page-${String(i + 1).padStart(3, "0")}.png`, b));
        const blob = await zip.generateAsync({ type: "blob" });
        download(blob, files[0].name.replace(/\.pdf$/i, "-pages.zip"));
      }
      toast.success("Done.");
    } catch (e: any) {
      toast.error(e?.message || "Operation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="pdf-tools" className="mt-20">
      <div className="text-center mb-6">
        <div className="text-[11px] tracking-widest uppercase text-muted-foreground">PDF Tools</div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight" style={{ fontFamily: '"SF Pro Display", system-ui' }}>
          Merge, split, rotate, extract.
        </h3>
      </div>

      <div className="glass-strong rounded-3xl p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { id: "merge", label: "Merge", Icon: Combine },
            { id: "split", label: "Split", Icon: Scissors },
            { id: "rotate", label: "Rotate", Icon: RotateCw },
            { id: "images", label: "Extract pages → PNG", Icon: ImageDown },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border ${
                mode === id ? "border-foreground bg-foreground text-background" : "border-border bg-surface-2 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        <div
          {...getRootProps()}
          className={`rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground cursor-pointer ${
            isDragActive ? "ring-2 ring-foreground/30" : ""
          }`}
        >
          <input {...getInputProps()} />
          <FileText className="mx-auto mb-2 h-6 w-6" />
          {files.length === 0
            ? "Drop PDF file(s) here, or click to select"
            : `${files.length} file${files.length > 1 ? "s" : ""} ready${pageCount ? ` · ${pageCount} pages in first` : ""}`}
        </div>

        {mode === "split" && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="text-[11px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5">
              Page range
              <InfoTip title="Page range" what='Comma-separated. Ex: "1-3,5,8-10".' pro="Use to extract chapters." beginner='Type "1-3" to keep pages 1, 2, 3.' />
            </label>
            <input value={range} onChange={(e) => setRange(e.target.value)}
              className="rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border w-48" />
          </div>
        )}
        {mode === "rotate" && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Angle</label>
            {([90, 180, 270] as const).map((a) => (
              <button key={a} onClick={() => setAngle(a)}
                className={`rounded-full px-3 py-1.5 text-xs border ${angle === a ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                {a}°
              </button>
            ))}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={run}
          disabled={busy || files.length === 0}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background disabled:opacity-50"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Run
        </motion.button>
      </div>
    </section>
  );
}
