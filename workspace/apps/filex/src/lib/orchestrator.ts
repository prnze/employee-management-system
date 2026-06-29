// Conversion orchestrator: routes a job to the right engine, drives progress.
import { useFx, type Job, type HistoryEntry, type Stage } from "./store";
import { convertImage } from "./conversion/image";
import { convertMedia } from "./conversion/ffmpeg";
import { textToPdf, pdfToText, textLikeConvert } from "./conversion/pdf";
import { filesToZip, zipToTar, fileToTar, gzipFile, zipExtract } from "./conversion/archive";

const ACTIVE = new Map<string, AbortController>();

export function cancelJob(id: string) {
  const a = ACTIVE.get(id);
  a?.abort();
  ACTIVE.delete(id);
  useFx.getState().updateJob(id, { status: "canceled", progress: 0, stage: undefined });
}

function setStage(id: string, stage: Stage) {
  useFx.getState().updateJob(id, { stage });
}

export async function runJob(job: Job): Promise<void> {
  const { updateJob, pushHistory } = useFx.getState();
  if (!job.sourceFile) {
    updateJob(job.id, { status: "error", errorMessage: "Source file missing (browser memory cleared on reload)." });
    return;
  }
  if (job.needsBackend) {
    updateJob(job.id, { status: "error", errorMessage: "Requires FileX Pro backend." });
    return;
  }

  const controller = new AbortController();
  ACTIVE.set(job.id, controller);
  const started = performance.now();
  updateJob(job.id, { status: "converting", startedAt: Date.now(), progress: 0, errorMessage: undefined, stage: "preparing" });

  const onP = (p: number) => {
    const elapsed = (performance.now() - started) / 1000;
    const eta = p > 5 ? Math.max(0, Math.round((elapsed / p) * (100 - p))) : undefined;
    const stage: Stage = p < 10 ? "analyzing" : p < 85 ? "converting" : p < 98 ? "compressing" : "finalizing";
    useFx.getState().updateJob(job.id, { progress: Math.max(0, Math.min(100, p)), etaSec: eta, stage });
  };

  try {
    let result: { blob: Blob; name: string };
    const from = job.fromExt.toLowerCase();
    const to = job.toExt.toLowerCase();
    const opts = (job.options || {}) as Record<string, any>;

    setStage(job.id, "analyzing");

    if (job.category === "image") {
      result = await convertImage(job.sourceFile, to, {
        quality: opts.quality, maxWidth: opts.maxWidth, maxHeight: opts.maxHeight,
      }, onP);
    } else if (job.category === "audio" || job.category === "video") {
      result = await convertMedia(job.sourceFile, to, {
        signal: controller.signal,
        audioBitrateKbps: opts.audioBitrateKbps, videoBitrateKbps: opts.videoBitrateKbps,
        width: opts.width, height: opts.height, fps: opts.fps,
      }, onP);
    } else if (job.category === "pdf") {
      if (to === "pdf" && (from === "txt" || from === "md")) result = await textToPdf(job.sourceFile, onP);
      else if (from === "pdf" && to === "txt") result = await pdfToText(job.sourceFile, onP);
      else result = await textLikeConvert(job.sourceFile, to, onP);
    } else if (job.category === "archive") {
      if (to === "zip" && from !== "zip") result = await filesToZip([job.sourceFile], onP);
      else if (to === "tar") result = from === "zip" ? await zipToTar(job.sourceFile, onP) : await fileToTar(job.sourceFile, onP);
      else if (to === "gz") result = await gzipFile(job.sourceFile, onP);
      else if (to === "zip" && from === "zip") {
        const entries = await zipExtract(job.sourceFile, onP);
        const files = entries.map((e) => new File([e.blob], e.name));
        result = await filesToZip(files, onP);
      } else throw new Error("Archive conversion target not supported in browser.");
    } else {
      throw new Error("Unsupported category.");
    }

    if (controller.signal.aborted) return;

    setStage(job.id, "finalizing");

    updateJob(job.id, {
      status: "done", progress: 100, finishedAt: Date.now(),
      resultBlob: result.blob, resultName: result.name, resultSize: result.blob.size,
      etaSec: 0, stage: "completed",
    });

    const entry: HistoryEntry = {
      id: job.id, fileName: job.fileName, fromExt: job.fromExt, toExt: job.toExt,
      category: job.category, inSize: job.fileSize, outSize: result.blob.size,
      durationMs: performance.now() - started, finishedAt: Date.now(),
    };
    pushHistory(entry);
  } catch (err: any) {
    if (controller.signal.aborted) return;
    updateJob(job.id, { status: "error", errorMessage: err?.message || "Conversion failed.", stage: undefined });
  } finally {
    ACTIVE.delete(job.id);
  }
}

export function downloadJob(job: Job) {
  if (!job.resultBlob || !job.resultName) return;
  const url = URL.createObjectURL(job.resultBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = job.resultName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
