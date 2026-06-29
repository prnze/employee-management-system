import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { springSnappy } from "@shared/animations/motion";

export type ThemeOption<TTheme extends string> = {
  key: TTheme;
  label: string;
  Icon: LucideIcon;
};

type SegmentedThemeSwitcherProps<TTheme extends string> = {
  theme: TTheme;
  options: ThemeOption<TTheme>[];
  onThemeChange: (theme: TTheme) => void;
  variant?: "brand" | "solid";
};

export function SegmentedThemeSwitcher<TTheme extends string>({
  theme,
  options,
  onThemeChange,
  variant = "brand",
}: SegmentedThemeSwitcherProps<TTheme>) {
  const isBrand = variant === "brand";

  return (
    <div className={`${isBrand ? "glass-panel" : "glass"} relative flex items-center rounded-full p-1`}>
      {options.map(({ key, label, Icon }) => {
        const active = theme === key;
        return (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            aria-label={label}
            title={label}
            className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-xs transition-colors ${
              active && !isBrand
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && isBrand && (
              <motion.div
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full brand-bg"
                transition={springSnappy}
              />
            )}
            <Icon
              className={`relative z-10 h-3.5 w-3.5 ${
                active && isBrand ? "text-white mix-blend-difference" : ""
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
