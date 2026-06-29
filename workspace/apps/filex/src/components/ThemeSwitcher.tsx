import { useFx, type Theme } from "@/lib/store";
import { Sun, MoonStar, Circle } from "lucide-react";
import { SegmentedThemeSwitcher } from "@shared/theme/SegmentedThemeSwitcher";

const OPTIONS = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark Grey", Icon: MoonStar },
  { key: "pitch", label: "Pitch Black", Icon: Circle },
];

export function ThemeSwitcher() {
  const theme = useFx((s) => s.theme);
  const setTheme = useFx((s) => s.setTheme);
  return (
    <SegmentedThemeSwitcher
      theme={theme}
      options={OPTIONS}
      onThemeChange={(nextTheme) => setTheme(nextTheme as Theme)}
      variant="solid"
    />
  );
}
