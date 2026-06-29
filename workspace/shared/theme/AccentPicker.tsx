import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";

import {
  ACCENTS,
  DEFAULT_ACCENT_KEYS,
  resolveAccentColor,
  type AccentKey,
} from "@shared/theme/accent";

type AccentPickerProps = {
  accent: AccentKey;
  customAccent: string;
  onAccentChange: (accent: AccentKey) => void;
  onCustomAccentChange: (accent: string) => void;
};

export function AccentPicker({
  accent,
  customAccent,
  onAccentChange,
  onCustomAccentChange,
}: AccentPickerProps) {
  const [open, setOpen] = useState(false);
  const currentColor = resolveAccentColor(accent, customAccent);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="glass-panel flex h-10 w-10 items-center justify-center rounded-full"
        aria-label="Pick accent"
      >
        <Palette className="h-4 w-4" style={{ color: currentColor }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="glass-panel absolute right-0 z-50 mt-2 rounded-2xl p-3"
          >
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_ACCENT_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onAccentChange(key);
                    setOpen(false);
                  }}
                  className="relative h-7 w-7 rounded-full ring-1 ring-white/20 transition-transform hover:scale-110"
                  style={{ background: ACCENTS[key] }}
                  aria-label={key}
                >
                  {accent === key && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background brand-ring" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-glass-border pt-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Custom
              </span>
              <input
                type="color"
                value={customAccent}
                onChange={(event) => {
                  onCustomAccentChange(event.target.value);
                  onAccentChange("custom");
                }}
                className="h-7 w-12 cursor-pointer rounded border-0 bg-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
