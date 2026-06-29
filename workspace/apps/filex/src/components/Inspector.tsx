import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Copy, Image as ImageIcon, Music, Video, FileText, Archive, Check,
  Sparkles, Gauge, Cpu, MemoryStick, Clock, TrendingDown, Layers,
} from "lucide-react";
import { useFx, type Job } from "@/lib/store";
import { formatBytes } from "@/lib/formats";
import { inspectFile, estimateConversion, recommendTarget, type MediaInfo, type Estimate, type Recommendation } from "@/lib/inspector";
import { CompareSlider } from "./CompareSlider";

const CAT_ICON = { image: ImageIcon, audio: Music, video: Video, pdf: FileText, archive: Archive, unsupported: FileText } as const;

export function Inspector() {
  const inspectorId = useFx((s) => s.inspectorId);
  const setInspector = useFx((s) => s.setInspector);
  const job = useFx((s) => s.jobs.find((j) => j.id === inspectorId));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspector(null);
      if ((e.key === "i" || e.key === "I") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const sel = useFx.getState().selectedIds[0] || useFx.getState().jobs[0]?.id;
        if (sel) setInspector(sel);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setInspector]);

  return (
    <AnimatePresence>
      {job && <InspectorPanel key={job.id} job={job} onClose={() => setInspector(null)} />}
    </AnimatePresence>
  );
}

function InspectorPanel({ job, onClose }: { job: Job; onClose: () => void }) {
  const Icon = CAT_ICON[job.category];
  const [info, setInfo] = useState<MediaInfo>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (job.sourceFile) {
      inspectFile(job.sourceFile, job.category).then((i) => {
        if (!cancelled) {
          setInfo(i);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [job.id, job.sourceFile, job.category]);

  const estimate = useMemo<Estimate>(() => estimateConversion(job, info), [job, info]);
  const rec = useMemo<Recommendation | null>(() => recommendTarget(job), [job]);

  const beforeUrl = useMemo(() => (job.sourceFile ? URL.createObjectURL(job.sourceFile) : null), [job.sourceFile]);
  const afterUrl = useMemo(() => (job.resultBlob ? URL.createObjectURL(job.resultBlob) : null), [job.resultBlob]);
  useEffect(() => () => {
    if (beforeUrl) URL.revokeObjectURL(beforeUrl);
    if (afterUrl) URL.revokeObjectURL(afterUrl);
  }, [beforeUrl, afterUrl]);

  return (
    <motion.aside
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] glass-strong border-l border-border overflow-y-auto"
      role="dialog"
      aria-label="File inspector"
    >
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/60 border-b border-border px-5 py-4 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Inspector</div>
          <div className="truncate text-sm font-medium">{job.fileName}</div>
        </div>
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-2" title="Close · Esc">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="p-5 space-y-4">
        {rec && (
          <Card title="Smart recommendation" icon={Sparkles}>
            <div className="text-xs">
              Convert to <span className="font-semibold uppercase">{rec.to}</span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{rec.reason}</p>
            <div className="mt-2 flex items-center gap-2 text-[10px]">
              <Badge>−{rec.expectedReductionPct}% size</Badge>
              <Badge>{rec.expectedQualityPct}% quality</Badge>
            </div>
          </Card>
        )}

        <Card title="Conversion estimate" icon={Gauge}>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <Stat label="Input" value={formatBytes(job.fileSize)} />
            <Stat label="Estimated output" value={formatBytes(estimate.outBytes)} />
            <Stat label="Compression" value={`${estimate.savedPct}%`} icon={TrendingDown} />
            <Stat label="Quality" value={`${estimate.qualityPct}% · ${estimate.qualityLabel}`} />
            <Stat label="Expected loss" value={`${estimate.qualityLossPct}%`} />
            <Stat label="ETA" value={`${estimate.etaSec}s`} icon={Clock} />
            <Stat label="CPU" value={estimate.cpu} icon={Cpu} />
            <Stat label="Memory" value={estimate.memory} icon={MemoryStick} />
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div className="h-full bg-foreground" style={{ width: `${100 - estimate.savedPct}%` }} />
          </div>
        </Card>

        <Card title="File" icon={FileText}>
          <Row label="Original name" value={job.fileName} copy />
          <Row label="Output name" value={job.resultName || `${job.fileName.replace(/\.[^.]+$/, "")}.${job.toExt}`} copy />
          <Row label="Extension" value={job.fromExt.toUpperCase()} />
          <Row label="Mime type" value={job.sourceFile?.type || "—"} />
          <Row label="Category" value={job.category} />
          <Row label="Original size" value={formatBytes(job.fileSize)} />
          {job.resultSize !== undefined && <Row label="Output size" value={formatBytes(job.resultSize)} />}
        </Card>

        {(info.width || info.duration || info.bitrateKbps) && (
          <Card title="Media" icon={Layers}>
            {info.width !== undefined && <Row label="Dimensions" value={`${info.width} × ${info.height}`} />}
            {info.aspect && <Row label="Aspect ratio" value={info.aspect} />}
            {info.duration !== undefined && <Row label="Duration" value={`${info.duration.toFixed(2)}s`} />}
            {info.bitrateKbps !== undefined && <Row label="Bitrate" value={`${info.bitrateKbps} kbps`} />}
            {info.transparency !== undefined && <Row label="Transparency" value={info.transparency ? "Yes" : "No"} />}
            {loading && <div className="text-[10px] text-muted-foreground">Analyzing…</div>}
          </Card>
        )}

        {job.category === "image" && beforeUrl && afterUrl && (
          <Card title="Compare" icon={ImageIcon}>
            <CompareSlider before={beforeUrl} after={afterUrl} />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>Before · {formatBytes(job.fileSize)}</span>
              <span>After · {formatBytes(job.resultSize || 0)}</span>
            </div>
          </Card>
        )}

        <Card title="Notes" icon={Sparkles}>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            FileX runs every conversion on-device via WebAssembly. Nothing is uploaded.
            Estimates are heuristic — actual results depend on content complexity and encoder behaviour.
          </p>
        </Card>
      </div>
    </motion.aside>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {title}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 py-1 text-[11px] border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 min-w-0">
        <span className="truncate font-mono" title={value}>{value}</span>
        {copy && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(value);
              setDone(true);
              setTimeout(() => setDone(false), 1200);
            }}
            className="text-muted-foreground hover:text-foreground"
            title="Copy"
          >
            {done ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        )}
      </span>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="rounded-xl bg-surface-2 p-2.5">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground">
        {Icon && <Icon className="h-2.5 w-2.5" />} {label}
      </div>
      <div className="mt-1 font-mono text-xs">{value}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono">{children}</span>;
}
