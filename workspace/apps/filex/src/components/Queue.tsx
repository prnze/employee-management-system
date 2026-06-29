import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import {
  X, Download, RotateCcw, Trash2, FileText, Image as ImageIcon,
  Music, Video, Archive, AlertTriangle, CheckCircle2, Loader2, Play, Info, Sparkles,
} from "lucide-react";
import { useFx, type Job, type Stage } from "@/lib/store";
import { formatBytes, targetsFor } from "@/lib/formats";
import { runJob, cancelJob, downloadJob } from "@/lib/orchestrator";
import { recommendTarget } from "@/lib/inspector";
import { InfoTip } from "./InfoTip";
import { JobSettings } from "./JobSettings";
import { BatchActions } from "./BatchActions";

const CAT_ICON = {
  image: ImageIcon, audio: Music, video: Video, pdf: FileText, archive: Archive, unsupported: AlertTriangle,
} as const;

const STAGES: Stage[] = ["preparing", "analyzing", "converting", "compressing", "finalizing", "completed"];

export function Queue() {
  const jobs = useFx((s) => s.jobs);

  useEffect(() => {
    const next = jobs.find((j) => j.status === "queued");
    const anyConverting = jobs.some((j) => j.status === "converting");
    if (next && !anyConverting) runJob(next);
  }, [jobs]);

  if (jobs.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Queue · {jobs.length}</h3>
        <BatchActions />
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {jobs.map((j) => <JobRow key={j.id} job={j} />)}
        </AnimatePresence>
      </div>
    </section>
  );
}

function JobRow({ job }: { job: Job }) {
  const updateJob = useFx((s) => s.updateJob);
  const removeJob = useFx((s) => s.removeJob);
  const selected = useFx((s) => s.selectedIds.includes(job.id));
  const toggleSelected = useFx((s) => s.toggleSelected);
  const setInspector = useFx((s) => s.setInspector);
  const Icon = CAT_ICON[job.category];
  const targets = targetsFor(job.fromExt);
  const rec = recommendTarget(job);

  const statusColor =
    job.status === "done" ? "text-success" :
    job.status === "error" ? "text-destructive" :
    job.status === "converting" ? "text-foreground" : "text-muted-foreground";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      onDoubleClick={() => setInspector(job.id)}
      onContextMenu={(e) => { e.preventDefault(); setInspector(job.id); }}
      className={`glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-3 transition-colors ${
        selected ? "ring-1 ring-foreground/40" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelected(job.id)}
        className="h-4 w-4 accent-foreground"
        aria-label="Select job"
      />
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-foreground">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium" title={job.fileName}>{job.fileName}</div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {job.fromExt} → {job.toExt}
          </span>
          {rec && rec.to === job.toExt && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-2.5 w-2.5" /> Recommended
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>{formatBytes(job.fileSize)}</span>
          {job.resultSize ? <span>→ {formatBytes(job.resultSize)}</span> : null}
          {job.etaSec !== undefined && job.status === "converting" ? <span>· ETA {job.etaSec}s</span> : null}
          {job.stage && job.status === "converting" && (
            <span className="capitalize">· {job.stage}</span>
          )}
          <span className={`ml-auto inline-flex items-center gap-1 ${statusColor}`}>
            {job.status === "converting" && <Loader2 className="h-3 w-3 animate-spin" />}
            {job.status === "done" && <CheckCircle2 className="h-3 w-3" />}
            {job.status === "error" && <AlertTriangle className="h-3 w-3" />}
            {job.status}
          </span>
        </div>

        <div className="mt-2 h-1 w-full rounded-full bg-surface-3 overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={false}
            animate={{ width: `${job.progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
          />
        </div>

        {job.status === "converting" && job.stage && (
          <div className="mt-2 flex items-center gap-1">
            {STAGES.map((s, i) => {
              const cur = STAGES.indexOf(job.stage as Stage);
              const active = i <= cur;
              return (
                <div key={s} className={`flex-1 h-0.5 rounded-full ${active ? "bg-foreground" : "bg-surface-3"}`} title={s} />
              );
            })}
          </div>
        )}

        {job.errorMessage && <p className="mt-2 text-[11px] text-destructive">{job.errorMessage}</p>}
      </div>

      <div className="flex items-center gap-2">
        {job.status !== "done" && job.status !== "error" && targets.length > 0 && (
          <div className="flex items-center gap-1">
            <select
              value={job.toExt}
              disabled={job.status === "converting"}
              onChange={(e) => updateJob(job.id, { toExt: e.target.value })}
              className="rounded-lg bg-surface-2 px-2 py-1.5 text-xs border border-border focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              {targets.map((t) => (
                <option key={t.ext} value={t.ext} disabled={!t.supported}>
                  {t.label}{t.supported ? "" : " (Pro)"}
                </option>
              ))}
            </select>
            <InfoTip
              title="Target format"
              what="Choose the destination format. Items marked (Pro) need the FileX Pro backend."
              quality="Depends on codec/format"
              size="Varies — AVIF/WebP < JPG < PNG for photos"
              speed="WebP & MP3 are fastest in-browser"
              pro="Use WebP/AVIF for web, FLAC/WAV for audio masters."
              beginner="JPG for photos, MP3 for music, MP4 for video."
            />
          </div>
        )}

        {job.status === "queued" && (
          <button onClick={() => runJob(job)} className="grid h-8 w-8 place-items-center rounded-lg glass hover-lift" title="Start">
            <Play className="h-3.5 w-3.5" />
          </button>
        )}
        {job.status === "converting" && (
          <button onClick={() => cancelJob(job.id)} className="grid h-8 w-8 place-items-center rounded-lg glass hover-lift" title="Cancel">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {job.status === "done" && (
          <button
            onClick={() => downloadJob(job)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background hover-lift"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        )}
        {job.status === "error" && job.sourceFile && !job.needsBackend && (
          <button
            onClick={() => runJob({ ...job, status: "queued", progress: 0, errorMessage: undefined })}
            className="grid h-8 w-8 place-items-center rounded-lg glass hover-lift"
            title="Retry"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => setInspector(job.id)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Inspect (⌘I)"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        <JobSettings job={job} />
        <button
          onClick={() => removeJob(job.id)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
