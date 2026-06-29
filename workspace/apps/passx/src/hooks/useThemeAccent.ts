import { useEffect } from "react";
import { resolveAccentColor } from "@shared/theme/accent";
import { applyDocumentTheme } from "@shared/theme/document-theme";
import { usePassStore } from "@/store/usePassStore";

export function useThemeAccent() {
  const { theme, accent, customAccent } = usePassStore();
  useEffect(() => {
    applyDocumentTheme({
      theme,
      blackTheme: "black",
      blackClass: "black",
      accentColor: resolveAccentColor(accent, customAccent),
    });
  }, [theme, accent, customAccent]);
}
