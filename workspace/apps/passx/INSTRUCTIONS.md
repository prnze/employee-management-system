# PassX — Setup Instructions

A premium password generator built with React 19, Vite, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, and Zustand.

## 1. Prerequisites

- Node.js 20+ (or Bun 1.1+)
- A package manager: bun (recommended), pnpm, npm, or yarn

## 2. Unzip & install

```bash
unzip passx-source.zip
cd passx

# pick one
bun install
# or: npm install
# or: pnpm install
```

## 3. Run the dev server

```bash
bun dev
# or: npm run dev
```

Open http://localhost:8080 (TanStack Start dev server).

## 4. Build for production

```bash
bun run build
bun run preview     # serve the built output locally
```

## 5. Project structure

```
src/
  routes/
    __root.tsx           # root layout, fonts, head meta
    index.tsx            # PassX app (home page)
  components/
    passx/               # PassX-specific components
      ThemeSwitcher.tsx
      AccentPicker.tsx
      OptionRow.tsx
      Stats.tsx
      History.tsx
      CommandPalette.tsx
      AmbientBackground.tsx
    ui/                  # shadcn/ui primitives
  lib/
    passwordEngine.ts    # generation + entropy/strength/crack-time
  store/
    usePassStore.ts      # Zustand store (persisted to localStorage)
  hooks/
    useThemeAccent.ts    # applies theme + accent CSS vars
  styles.css             # Tailwind v4 design system + glass utilities
```

## 6. Editing the design system

All colors, glass effects, themes, and accent tokens live in `src/styles.css`.
- Three themes via `.dark` / `.black` classes on `<html>`
- Accent is a single CSS variable `--brand` driven by the store
- Glass surfaces use the `glass-panel` / `glass-card` `@utility` classes

## 7. Keyboard shortcuts

- **Cmd/Ctrl + K** — Command palette
- **Cmd/Ctrl + R** — Regenerate (inside the app)

## 8. Notes

- All randomness uses `crypto.getRandomValues` (no math.random).
- History, favorites, theme, accent persist in `localStorage` under the key `passx-store`.
- The home route is set to `ssr: false` because it relies on browser crypto + localStorage.

Enjoy. ⌘
