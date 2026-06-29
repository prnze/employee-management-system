import { Sun, Moon, Circle } from "lucide-react";
import { SegmentedThemeSwitcher } from "@shared/theme/SegmentedThemeSwitcher";
import { usePassStore, type Theme } from "@/store/usePassStore";

const themes = [
  { key: "light", Icon: Sun, label: "Light" },
  { key: "dark", Icon: Moon, label: "Graphite" },
  { key: "black", Icon: Circle, label: "OLED" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = usePassStore();
  return (
    <SegmentedThemeSwitcher
      theme={theme}
      options={themes}
      onThemeChange={(nextTheme) => setTheme(nextTheme as Theme)}
      variant="brand"
    />
  );
}
