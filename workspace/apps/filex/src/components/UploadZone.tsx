import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FolderUp, ClipboardPaste } from "lucide-react";
import { categoryOf, getExt } from "@/lib/formats";
import { useFx, type Job } from "@/lib/store";

function makeJob(file: File): Job {
  const fromExt = getExt(file.name);
  const category = categoryOf(fromExt);
  // pick a sensible default target
  const defaults: Record<string, string> = {
    image: "webp", audio: "mp3", video: "mp4", pdf: "pdf", archive: "zip", unsupported: "",
  };
  let toExt = defaults[category];
  if (category === "image" && ["heic", "heif"].includes(fromExt)) toExt = "jpg";
  if (category === "pdf" && (fromExt === "txt" || fromExt === "md")) toExt = "pdf";
  if (category === "pdf" && fromExt === "pdf") toExt = "txt";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    fileSize: file.size,
    fromExt,
    toExt: toExt || fromExt,
    category,
    status: category === "unsupported" ? "error" : "queued",
    progress: 0,
    needsBackend: category === "unsupported",
    errorMessage: category === "unsupported" ? "Format not supported in browser. Requires FileX Pro backend." : undefined,
    sourceFile: file,
  };
}

export function UploadZone() {
  const addJobs = useFx((s) => s.addJobs);

  const onDrop = useCallback(
    (files: File[]) => {
      const jobs = files.map(makeJob);
      addJobs(jobs);
    },
    [addJobs],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
  });

  const onPaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      const files: File[] = [];
      for (const it of items) {
        for (const t of it.types) {
          if (t.startsWith("image/")) {
            const blob = await it.getType(t);
            files.push(new File([blob], `clipboard-${Date.now()}.${t.split("/")[1]}`, { type: t }));
          }
        }
      }
      if (files.length) onDrop(files);
    } catch {}
  };

  return (
    <div
      {...getRootProps()}
      className={`relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-14 transition-all animate-[scale-in_0.4s_ease-out] ${
        isDragActive ? "ring-2 ring-foreground/30 scale-[1.005]" : ""
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center gap-5">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative grid h-20 w-20 place-items-center rounded-3xl glass shadow-floating"
        >
          <Upload className="h-8 w-8 text-foreground" />
        </motion.div>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Drop files here, anywhere, anytime
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Images · Audio · Video · PDF · Archives — all processed locally in your browser.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover-lift"
          >
            <Upload className="h-4 w-4" /> Choose files
          </button>
          <button
            type="button"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              (input as HTMLInputElement & { webkitdirectory: boolean }).webkitdirectory = true;
              input.multiple = true;
              input.onchange = () => input.files && onDrop(Array.from(input.files));
              input.click();
            }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover-lift"
          >
            <FolderUp className="h-4 w-4" /> Folder
          </button>
          <button
            type="button"
            onClick={onPaste}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover-lift"
          >
            <ClipboardPaste className="h-4 w-4" /> Paste
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Files never leave your device. Conversion runs on-device via WebAssembly.
        </p>
      </div>
    </div>
  );
}
