import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { usePassStore } from "@/store/usePassStore";

export function History() {
  const { history, clearHistory } = usePassStore();
  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <Clock className="h-3 w-3" /> History
        </div>
        {history.length > 0 && (
          <button
            onClick={() => { clearHistory(); toast.success("History cleared"); }}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
      <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {history.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">No passwords yet</div>
          )}
          {history.map(h => (
            <motion.div
              key={h.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/50"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[12px]">{h.password}</div>
                <div className="text-[10px] text-muted-foreground">{h.entropy} bits · {new Date(h.at).toLocaleTimeString()}</div>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(h.password); toast.success("Copied"); }}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Copy"
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
