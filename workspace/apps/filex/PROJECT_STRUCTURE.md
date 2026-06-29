# Project Structure

```
.
├── README.md
├── INSTALLATION.md
├── PROJECT_STRUCTURE.md
├── REQUIRED_PACKAGES.txt
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── styles.css                 # Tailwind v4 + design tokens (3 themes)
│   ├── router.tsx                 # TanStack Router setup
│   ├── start.ts                   # TanStack Start client entry
│   ├── server.ts                  # TanStack Start server entry
│   ├── routes/
│   │   ├── __root.tsx             # Root shell, head/meta, providers
│   │   └── index.tsx              # FileX home (hero, upload, queue, history, formats)
│   ├── components/
│   │   ├── FileXLogo.tsx
│   │   ├── ThemeManager.tsx       # Applies .dark / .pitch on <html>
│   │   ├── ThemeSwitcher.tsx
│   │   ├── Hero.tsx               # Hero with floating glass doodles
│   │   ├── UploadZone.tsx         # Drag/drop, folder, paste
│   │   ├── Queue.tsx              # Live job list with progress
│   │   ├── HistoryPanel.tsx       # Stats + recent conversions
│   │   ├── CommandPalette.tsx     # ⌘K palette (cmdk)
│   │   ├── InfoTip.tsx            # ⓘ tooltip
│   │   └── ui/                    # shadcn primitives (unmodified)
│   ├── lib/
│   │   ├── store.ts               # Zustand store (theme, jobs, history)
│   │   ├── formats.ts             # Format registry + category routing
│   │   ├── orchestrator.ts        # Routes jobs to engines, drives progress
│   │   └── conversion/
│   │       ├── image.ts           # Canvas + heic2any + browser-image-compression
│   │       ├── ffmpeg.ts          # @ffmpeg/ffmpeg lazy-loaded
│   │       ├── pdf.ts             # pdf-lib utilities
│   │       └── archive.ts         # JSZip + USTAR tar encoder
│   └── hooks/
└── public/
```

## Adding a new format

1. Add it to `src/lib/formats.ts` (`FORMATS` array, `categoryOf` mapping).
2. Implement the encode path in the matching `src/lib/conversion/*.ts` engine.
3. The Queue UI and command palette pick it up automatically.

## Adding a new conversion engine

1. Create `src/lib/conversion/<engine>.ts` exposing an async function that takes `(File, options, onProgress)` and returns `{ blob, name }`.
2. Wire it into `src/lib/orchestrator.ts` `runJob()` for the appropriate category.

## Future backend (FileX Pro)

The orchestrator marks jobs as `needsBackend: true` when a target format isn't supported in-browser. To wire a real backend:

1. Add a `src/lib/conversion/backend.ts` that POSTs the file + target ext to your server.
2. In `orchestrator.runJob`, route `needsBackend` jobs through it instead of failing.
3. The Queue UI already renders progress, cancel, retry, and download for any source.
