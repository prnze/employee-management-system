import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { RefreshCw, Copy, Eye, Sun, Moon, Circle, Trash2 } from "lucide-react";
import { usePassStore } from "@/store/usePassStore";

export function CommandPalette({ onRegenerate, onCopy, onToggleVisibility }: {
  onRegenerate: () => void;
  onCopy: () => void;
  onToggleVisibility: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { setTheme, clearHistory } = usePassStore();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen(o => !o);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "r" && !e.shiftKey) {
        e.preventDefault(); onRegenerate();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onRegenerate]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-[520px] max-w-[90vw] overflow-hidden rounded-2xl"
          >
            <Command label="Command palette">
              <Command.Input
                placeholder="Type a command..."
                className="w-full border-0 border-b border-glass-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-xs text-muted-foreground">No results</Command.Empty>
                <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground">
                  <Item icon={<RefreshCw className="h-3.5 w-3.5" />} onSelect={() => { onRegenerate(); setOpen(false); }}>Regenerate password</Item>
                  <Item icon={<Copy className="h-3.5 w-3.5" />} onSelect={() => { onCopy(); setOpen(false); }}>Copy password</Item>
                  <Item icon={<Eye className="h-3.5 w-3.5" />} onSelect={() => { onToggleVisibility(); setOpen(false); }}>Toggle visibility</Item>
                  <Item icon={<Trash2 className="h-3.5 w-3.5" />} onSelect={() => { clearHistory(); setOpen(false); }}>Clear history</Item>
                </Command.Group>
                <Command.Group heading="Theme" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground">
                  <Item icon={<Sun className="h-3.5 w-3.5" />} onSelect={() => { setTheme("light"); setOpen(false); }}>Light mode</Item>
                  <Item icon={<Moon className="h-3.5 w-3.5" />} onSelect={() => { setTheme("dark"); setOpen(false); }}>Graphite mode</Item>
                  <Item icon={<Circle className="h-3.5 w-3.5" />} onSelect={() => { setTheme("black"); setOpen(false); }}>OLED black mode</Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Item({ icon, children, onSelect }: { icon: React.ReactNode; children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{children}</span>
    </Command.Item>
  );
}
