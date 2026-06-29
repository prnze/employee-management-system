import { useEffect } from "react";
import { applyDocumentTheme } from "@shared/theme/document-theme";
import { useFx } from "@/lib/store";

export function ThemeManager() {
  const theme = useFx((s) => s.theme);
  useEffect(() => {
    applyDocumentTheme({
      theme,
      blackTheme: "pitch",
      blackClass: "pitch",
    });
  }, [theme]);
  return null;
}
