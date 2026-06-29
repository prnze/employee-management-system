# Installation

## Prerequisites

- Node.js 20+ or Bun 1.1+
- A modern browser (Chrome 110+, Safari 16.4+, Firefox 113+) for AVIF/WebP encode and WebAssembly SIMD

## Install

```bash
# with bun (recommended)
bun install
bun run dev

# or with npm
npm install
npm run dev
```

The dev server starts at **http://localhost:8080**.

## Build for production

```bash
bun run build
bun run start
```

## First-run notes

- The first audio/video conversion downloads ffmpeg-core (~30 MB WASM). Subsequent runs use the browser cache.
- HEIC decoding pulls `heic2any` on demand the first time you drop a HEIC file.
- Files never leave your device. All conversion is local.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Canvas could not encode image/avif` | Your browser doesn't support AVIF encoding. Convert to WEBP or use a recent Chrome/Edge. |
| ffmpeg hangs on large videos | Browsers cap WASM memory near 2 GB. Use shorter clips or the FileX Pro backend. |
| HEIC file shows "decode failed" | Some HEIC variants from older iPhones use unsupported subsampling. Re-export from Photos as HEIC and retry. |
