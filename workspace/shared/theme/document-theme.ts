export type DocumentThemeOptions = {
  theme: string;
  darkTheme?: string;
  blackTheme?: string;
  darkClass?: string;
  blackClass?: string;
  accentColor?: string;
};

export function applyDocumentTheme({
  theme,
  darkTheme = "dark",
  blackTheme = "black",
  darkClass = "dark",
  blackClass = "black",
  accentColor,
}: DocumentThemeOptions) {
  const root = document.documentElement;
  root.classList.remove(darkClass, blackClass);
  if (theme === darkTheme) root.classList.add(darkClass);
  if (theme === blackTheme) root.classList.add(blackClass);
  root.style.colorScheme = theme === "light" ? "light" : "dark";

  if (accentColor) {
    root.style.setProperty("--accent-color", accentColor);
    root.style.setProperty("--brand", accentColor);
  }
}
