export type AccentKey =
  | "blue"
  | "purple"
  | "pink"
  | "orange"
  | "green"
  | "red"
  | "yellow"
  | "cyan"
  | "white"
  | "custom";

export const ACCENTS: Record<AccentKey, string> = {
  blue: "oklch(0.62 0.18 255)",
  purple: "oklch(0.6 0.22 305)",
  pink: "oklch(0.7 0.22 0)",
  orange: "oklch(0.72 0.18 50)",
  green: "oklch(0.68 0.17 150)",
  red: "oklch(0.62 0.23 27)",
  yellow: "oklch(0.82 0.16 95)",
  cyan: "oklch(0.78 0.13 200)",
  white: "oklch(0.98 0 0)",
  custom: "oklch(0.62 0.18 255)",
};

export const DEFAULT_ACCENT_KEYS: AccentKey[] = [
  "blue",
  "purple",
  "pink",
  "orange",
  "green",
  "red",
  "yellow",
  "cyan",
  "white",
];

export function resolveAccentColor(accent: AccentKey, customAccent: string) {
  return accent === "custom" ? customAccent : ACCENTS[accent];
}
