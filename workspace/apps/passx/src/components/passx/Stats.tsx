import { motion } from "framer-motion";
import { strengthLabel, crackTime, charDistribution } from "@/lib/passwordEngine";

export function Stats({ password, entropy: ent, poolSize }: { password: string; entropy: number; poolSize: number }) {
  const s = strengthLabel(ent);
  const ct = crackTime(ent);
  const dist = charDistribution(password);
  const total = Math.max(1, password.length);
  const bars = [
    { k: "A-Z", v: dist.upper },
    { k: "a-z", v: dist.lower },
    { k: "0-9", v: dist.number },
    { k: "#@!", v: dist.symbol },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Length" value={password.length.toString()} sub="characters" />
      <Card label="Entropy" value={`${ent}`} sub="bits" />
      <Card label="Strength" value={s.label} sub={`score ${s.score}/5`} accent={s.color} />
      <Card label="Crack time" value={ct} sub="@ 10¹¹ guesses/s" />
      <div className="glass-card col-span-full p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Character distribution</div>
          <div className="text-[11px] text-muted-foreground">pool: {poolSize}</div>
        </div>
        <div className="space-y-2">
          {bars.map(b => (
            <div key={b.k} className="flex items-center gap-3">
              <span className="w-10 text-[11px] text-muted-foreground">{b.k}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(b.v / total) * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="h-full brand-bg"
                />
              </div>
              <span className="w-8 text-right text-[11px] tabular-nums text-muted-foreground">{b.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card p-4"
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-xl font-semibold" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </motion.div>
  );
}
