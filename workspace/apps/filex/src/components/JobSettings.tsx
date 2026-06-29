import { useState } from "react";
import { Settings2, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useFx, type Job } from "@/lib/store";
import { InfoTip } from "./InfoTip";
import { PRESETS } from "@/lib/presets";

export function JobSettings({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const updateJob = useFx((s) => s.updateJob);
  const opts = (job.options || {}) as Record<string, any>;
  const set = (patch: Record<string, any>) => updateJob(job.id, { options: { ...opts, ...patch } });
  const disabled = job.status === "converting" || job.status === "done";
  const presets = PRESETS[job.category] || [];

  const applyPreset = (id: string) => {
    const p = presets.find((x) => x.id === id);
    if (!p) return;
    updateJob(job.id, { toExt: p.to, options: { ...opts, ...p.options } });
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        title="Options"
      >
        <Settings2 className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="basis-full overflow-hidden"
          >
            <div className="mt-3 glass rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between col-span-full">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Advanced options</div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>

              {presets.length > 0 && (
                <label className="flex flex-col gap-1.5 col-span-full">
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                    <Sparkles className="h-3 w-3" /> Preset
                  </span>
                  <select
                    disabled={disabled}
                    defaultValue=""
                    onChange={(e) => e.target.value && applyPreset(e.target.value)}
                    className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border"
                  >
                    <option value="">Custom · choose a preset…</option>
                    {presets.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.description}</option>
                    ))}
                  </select>
                </label>
              )}

              {job.category === "image" && (
                <>
                  <Field label="Quality" tip={qualityTip}>
                    <input type="range" min={0.3} max={1} step={0.05} disabled={disabled}
                      defaultValue={opts.quality ?? 0.92}
                      onChange={(e) => set({ quality: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-[10px] text-muted-foreground">{Math.round((opts.quality ?? 0.92) * 100)}%</span>
                  </Field>
                  <Field label="Max width (px)" tip={resizeTip}>
                    <input type="number" min={32} disabled={disabled}
                      defaultValue={opts.maxWidth ?? ""}
                      placeholder="original"
                      onChange={(e) => set({ maxWidth: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border" />
                  </Field>
                  <Field label="Max height (px)" tip={resizeTip}>
                    <input type="number" min={32} disabled={disabled}
                      defaultValue={opts.maxHeight ?? ""}
                      placeholder="original"
                      onChange={(e) => set({ maxHeight: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border" />
                  </Field>
                </>
              )}

              {(job.category === "audio" || job.category === "video") && (
                <Field label="Audio bitrate (kbps)" tip={audioBitrateTip}>
                  <select disabled={disabled}
                    defaultValue={opts.audioBitrateKbps ?? 192}
                    onChange={(e) => set({ audioBitrateKbps: parseInt(e.target.value) })}
                    className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border">
                    {[96, 128, 160, 192, 256, 320].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              )}

              {job.category === "video" && (
                <>
                  <Field label="Video bitrate (kbps)" tip={videoBitrateTip}>
                    <select disabled={disabled}
                      defaultValue={opts.videoBitrateKbps ?? 2500}
                      onChange={(e) => set({ videoBitrateKbps: parseInt(e.target.value) })}
                      className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border">
                      {[500, 1000, 1500, 2500, 4000, 6000, 8000].map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Width (px)" tip={resizeTip}>
                    <input type="number" min={64} disabled={disabled}
                      defaultValue={opts.width ?? ""} placeholder="original"
                      onChange={(e) => set({ width: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border" />
                  </Field>
                  <Field label="Height (px)" tip={resizeTip}>
                    <input type="number" min={64} disabled={disabled}
                      defaultValue={opts.height ?? ""} placeholder="original"
                      onChange={(e) => set({ height: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border" />
                  </Field>
                  <Field label="FPS" tip={fpsTip}>
                    <select disabled={disabled}
                      defaultValue={opts.fps ?? ""}
                      onChange={(e) => set({ fps: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full rounded-md bg-surface-2 px-2 py-1.5 text-xs border border-border">
                      <option value="">source</option>
                      {[24, 25, 30, 50, 60].map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>
                </>
              )}

              {job.category === "pdf" && (
                <div className="col-span-full text-[11px] text-muted-foreground">
                  Use the PDF Tools panel below for merge / split / rotate / extract.
                </div>
              )}
              {job.category === "archive" && (
                <div className="col-span-full text-[11px] text-muted-foreground">
                  Archives are repacked with default deflate compression.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, tip, children }: { label: string; tip: any; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        {label} <InfoTip {...tip} />
      </span>
      {children}
    </label>
  );
}

const qualityTip = {
  title: "Quality",
  what: "Encoder quality target for lossy formats (JPG, WEBP, AVIF).",
  quality: "Higher = sharper, less artifacting",
  size: "Higher quality ≈ larger file",
  speed: "Negligible difference",
  pros: ["Visual fidelity"], cons: ["File size grows fast above 90%"],
  pro: "85–92% is the sweet spot for photos.",
  beginner: "Leave at 92% unless you need a smaller file.",
};
const resizeTip = {
  title: "Resize",
  what: "Caps the largest dimension. Aspect ratio is preserved.",
  quality: "Shrinking is lossy; upscaling never improves quality",
  size: "Big savings — area scales quadratically",
  speed: "Faster encode",
  pro: "Use 1920px for web hero, 2048px for retina, 4096px for print.",
  beginner: "Leave blank to keep the original size.",
};
const audioBitrateTip = {
  title: "Audio bitrate",
  what: "Kilobits per second of encoded audio.",
  quality: "192 kbps ≈ transparent for most listeners",
  size: "Linear: 320k ≈ 2.4 MB/min, 128k ≈ 1 MB/min",
  speed: "No effect on encode time",
  pro: "Use 256–320 for music masters, 96–128 for voice.",
  beginner: "192 is a safe default.",
};
const videoBitrateTip = {
  title: "Video bitrate",
  what: "Target bits per second for the video stream.",
  quality: "Higher = sharper, especially in motion",
  size: "Roughly linear in bitrate",
  speed: "Higher bitrate can slow encode slightly",
  pro: "1080p ≈ 4–6 Mbps, 720p ≈ 2–3 Mbps for streaming.",
  beginner: "2500 kbps works for most 720p clips.",
};
const fpsTip = {
  title: "Frames per second",
  what: "Output frame rate. Lower FPS = smaller file, choppier motion.",
  quality: "30 is standard, 60 for smooth motion",
  size: "Halving FPS ≈ halves file size",
  speed: "Lower FPS encodes faster",
  pro: "Match source FPS unless you need to shrink.",
  beginner: "Leave on source.",
};
