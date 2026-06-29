import { useRef, useState } from "react";

export function CompareSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  };

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-xl bg-surface-2 select-none touch-none aspect-video"
      onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
      onMouseDown={(e) => onMove(e.clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
    >
      <img src={after} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      </div>
      <div
        className="absolute inset-y-0 w-px bg-foreground/80 shadow-[0_0_12px_var(--color-foreground)]"
        style={{ left: `${pos}%` }}
      />
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full glass-strong text-[10px]"
        style={{ left: `${pos}%` }}
      >
        ⇄
      </div>
      <div className="absolute left-2 top-2 rounded-md glass px-1.5 py-0.5 text-[9px] uppercase tracking-widest">Before</div>
      <div className="absolute right-2 top-2 rounded-md glass px-1.5 py-0.5 text-[9px] uppercase tracking-widest">After</div>
    </div>
  );
}
