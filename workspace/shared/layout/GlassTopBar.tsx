import type { ReactNode } from "react";

type GlassTopBarProps = {
  brand: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
  className?: string;
  surfaceClassName?: string;
};

export function GlassTopBar({
  brand,
  nav,
  actions,
  className = "sticky top-0 z-40 px-4 pt-4 sm:px-8",
  surfaceClassName = "glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5",
}: GlassTopBarProps) {
  return (
    <header className={className}>
      <div className={surfaceClassName}>
        {brand}
        {nav}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
