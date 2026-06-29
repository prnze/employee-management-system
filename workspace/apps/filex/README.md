# FileX

> Convert Anything. Preserve Everything.

FileX is a premium, Apple-inspired universal media converter that runs **entirely in your browser**. No uploads. No tracking. Conversion happens on-device via WebAssembly.

## Features

- **Images** — JPG, PNG, WEBP, AVIF, GIF, BMP, ICO, SVG, HEIC/HEIF (decode)
- **Audio** — MP3, WAV, FLAC, AAC, M4A, OGG, OPUS, AIFF (via ffmpeg.wasm)
- **Video** — MP4, WEBM, MKV, MOV, AVI, animated GIF (via ffmpeg.wasm)
- **Documents** — PDF ↔ TXT, MD ↔ HTML, TXT → PDF, CSV
- **Archives** — ZIP creation, ZIP → TAR
- **Queue** with progress, ETA, cancel, retry, pause
- **History** with size-saved analytics
- **Command palette** (⌘K / Ctrl+K)
- **Three themes** — Light, Dark Grey, Pitch Black
- Glassmorphic UI, IBM Plex Mono typography, full keyboard support, responsive

## Architecture

- **Frontend**: React 19 + TypeScript + TanStack Start + Vite + Tailwind v4
- **State**: Zustand with localStorage persistence (history & theme)
- **Conversion engines** (all client-side):
  - `src/lib/conversion/image.ts` — Canvas API + browser-image-compression + heic2any
  - `src/lib/conversion/ffmpeg.ts` — @ffmpeg/ffmpeg (WebAssembly, lazy-loaded)
  - `src/lib/conversion/pdf.ts` — pdf-lib
  - `src/lib/conversion/archive.ts` — JSZip + custom USTAR encoder
- **Orchestrator** — `src/lib/orchestrator.ts` routes jobs to the right engine, drives progress and ETA, supports cancel.

Formats that genuinely need native binaries (RAW, LibreOffice docs, RAR/7z, professional video codecs) are surfaced in the UI as **"Requires FileX Pro backend"** with the full pipeline interface in place for a future server.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:8080.

## Project layout

See `PROJECT_STRUCTURE.md`.

## Dependencies

See `REQUIRED_PACKAGES.txt` and `package.json`.

## License

MIT — do what you want.
