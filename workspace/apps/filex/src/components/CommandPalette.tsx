import { Command } from "cmdk";
import { useEffect } from "react";
import { useFx } from "@/lib/store";
import { FORMATS } from "@/lib/formats";

export function CommandPalette() {
  const open = useFx((s) => s.commandOpen);
  const setOpen = useFx((s) => s.setCommandOpen);
  const setTheme = useFx((s) => s.setTheme);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-start pt-[12vh] px-4 bg-background/40 backdrop-blur-md" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl glass-strong rounded-2xl overflow-hidden shadow-floating">
        <Command label="FileX command palette">
          <Command.Input placeholder="Search formats, themes, actions…" className="w-full bg-transparent px-5 py-4 text-sm outline-none border-b border-border" />
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</Command.Empty>
            <Command.Group heading="Theme">
              {(["light", "dark", "pitch"] as const).map((t) => (
                <Command.Item key={t} onSelect={() => { setTheme(t); setOpen(false); }} className="px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-surface-2">
                  Switch to {t === "pitch" ? "Pitch Black" : t === "dark" ? "Dark Grey" : "Light"}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Formats">
              {FORMATS.slice(0, 40).map((f) => (
                <Command.Item key={f.ext + f.category} className="px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-surface-2">
                  <span className="font-medium uppercase mr-2">{f.ext}</span>
                  <span className="text-muted-foreground">{f.description}</span>
                  {!f.supported && <span className="ml-2 text-[10px] text-warning">PRO</span>}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
