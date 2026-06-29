import { useFx } from "@/lib/store";
import { formatBytes, formatDuration } from "@/lib/formats";
import { History as HistoryIcon, TrendingDown, TrendingUp } from "lucide-react";

export function HistoryPanel() {
  const history = useFx((s) => s.history);
  const clear = useFx((s) => s.clearHistory);
  if (history.length === 0) return null;

  const totals = history.reduce(
    (acc, h) => ({ in: acc.in + h.inSize, out: acc.out + h.outSize, count: acc.count + 1, ms: acc.ms + h.durationMs }),
    { in: 0, out: 0, count: 0, ms: 0 },
  );
  const saved = totals.in - totals.out;

  return (
    <section className="mt-12">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase inline-flex items-center gap-2">
          <HistoryIcon className="h-3.5 w-3.5" /> History
        </h3>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Conversions" value={totals.count.toString()} />
        <StatCard label="Total in" value={formatBytes(totals.in)} />
        <StatCard label="Total out" value={formatBytes(totals.out)} />
        <StatCard
          label={saved >= 0 ? "Saved" : "Added"}
          value={formatBytes(Math.abs(saved))}
          icon={saved >= 0 ? <TrendingDown className="h-3 w-3 text-success" /> : <TrendingUp className="h-3 w-3 text-warning" />}
        />
      </div>

      <div className="glass rounded-2xl divide-y divide-border overflow-hidden">
        {history.slice(0, 20).map((h) => (
          <div key={h.id} className="px-4 py-2.5 flex items-center gap-3 text-sm">
            <div className="truncate flex-1" title={h.fileName}>{h.fileName}</div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {h.fromExt} → {h.toExt}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">{formatBytes(h.outSize)}</span>
            <span className="text-xs text-muted-foreground tabular-nums w-14 text-right">{formatDuration(h.durationMs)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
