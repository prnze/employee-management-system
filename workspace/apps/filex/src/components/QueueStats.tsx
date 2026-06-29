import { useMemo } from "react";
import { motion } from "framer-motion";
import { Files, CheckCircle2, Loader2, AlertTriangle, Clock, HardDrive, TrendingDown, Gauge } from "lucide-react";
import { useFx } from "@/lib/store";
import { formatBytes, formatDuration } from "@/lib/formats";

export function QueueStats() {
  const jobs = useFx((s) => s.jobs);
  const history = useFx((s) => s.history);

  const stats = useMemo(() => {
    const total = jobs.length;
    const done = jobs.filter((j) => j.status === "done").length;
    const converting = jobs.filter((j) => j.status === "converting").length;
    const failed = jobs.filter((j) => j.status === "error").length;
    const waiting = jobs.filter((j) => j.status === "queued").length;
    const inSize = jobs.reduce((a, j) => a + j.fileSize, 0);
    const outSize = jobs.reduce((a, j) => a + (j.resultSize || 0), 0);
    const saved = Math.max(0, inSize - outSize);
    const avgCompression = inSize > 0 && outSize > 0 ? Math.round((1 - outSize / inSize) * 100) : 0;
    const totalMs = history.reduce((a, h) => a + h.durationMs, 0);
    return { total, done, converting, failed, waiting, inSize, outSize, saved, avgCompression, totalMs };
  }, [jobs, history]);

  if (jobs.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Statistics</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <Stat icon={Files} label="Files" value={stats.total} />
        <Stat icon={CheckCircle2} label="Completed" value={stats.done} accent="success" />
        <Stat icon={Loader2} label="Converting" value={stats.converting} />
        <Stat icon={AlertTriangle} label="Failed" value={stats.failed} accent="destructive" />
        <Stat icon={Clock} label="Waiting" value={stats.waiting} />
        <Stat icon={HardDrive} label="Input" value={formatBytes(stats.inSize)} />
        <Stat icon={HardDrive} label="Output" value={formatBytes(stats.outSize)} />
        <Stat icon={TrendingDown} label="Saved" value={formatBytes(stats.saved)} accent="success" />
        <Stat icon={Gauge} label="Avg compression" value={`${stats.avgCompression}%`} />
        <Stat icon={Clock} label="Total time" value={formatDuration(stats.totalMs)} />
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: any; accent?: "success" | "destructive" }) {
  const color =
    accent === "success" ? "text-success" :
    accent === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <motion.div layout className="glass rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-1.5 font-mono text-base ${color}`}>{value}</div>
    </motion.div>
  );
}
