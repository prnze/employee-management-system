import { Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface InfoTipProps {
  title: string;
  what?: string;
  quality?: string;
  size?: string;
  speed?: string;
  pros?: string[];
  cons?: string[];
  pro?: string;
  beginner?: string;
}

export function InfoTip(p: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={`About ${p.title}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          role="tooltip"
          className="glass-strong absolute left-1/2 top-6 z-50 w-80 -translate-x-1/2 rounded-xl p-4 text-xs leading-relaxed text-foreground"
        >
          <div className="mb-2 font-semibold tracking-tight text-sm">{p.title}</div>
          {p.what && <p className="mb-2 text-muted-foreground">{p.what}</p>}
          <dl className="grid grid-cols-3 gap-1 mb-2">
            {p.quality && (<><dt className="text-muted-foreground">Quality</dt><dd className="col-span-2">{p.quality}</dd></>)}
            {p.size && (<><dt className="text-muted-foreground">File size</dt><dd className="col-span-2">{p.size}</dd></>)}
            {p.speed && (<><dt className="text-muted-foreground">Speed</dt><dd className="col-span-2">{p.speed}</dd></>)}
          </dl>
          {p.pros && p.pros.length > 0 && (
            <div className="mb-1">
              <span className="text-muted-foreground">Pros:</span>{" "}
              <span>{p.pros.join(", ")}</span>
            </div>
          )}
          {p.cons && p.cons.length > 0 && (
            <div className="mb-2">
              <span className="text-muted-foreground">Cons:</span>{" "}
              <span>{p.cons.join(", ")}</span>
            </div>
          )}
          {p.pro && <div className="text-[11px] text-muted-foreground">▸ Pro: {p.pro}</div>}
          {p.beginner && <div className="text-[11px] text-muted-foreground">▸ Beginner: {p.beginner}</div>}
        </div>
      )}
    </div>
  );
}
