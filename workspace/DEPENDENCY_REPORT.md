# Dependency Report

## Summary

Dependencies were merged into one root npm workspace dependency graph.

- Runtime dependencies: 65
- Development dependencies: 16
- App package files now contain scripts only.
- Lovable-specific dependency removed: `@lovable.dev/vite-tanstack-config`

## Single-Version Dependencies

The workspace keeps one version of the shared stack:

- `react`
- `react-dom`
- `typescript`
- `vite`
- `framer-motion`
- `lucide-react`
- `tailwindcss`
- `clsx`
- `zod`
- `cmdk`
- `sonner`

## App-Specific Additions Preserved

- FileX conversion stack: `@ffmpeg/ffmpeg`, `@ffmpeg/util`, `browser-image-compression`, `heic2any`, `jszip`, `pdf-lib`, `pdfjs-dist`, `react-dropzone`.
- FormatX highlighting stack: `prismjs`, `@types/prismjs`.
- PassX/FileX state: `zustand`.

## Install Result

`npm install` completed successfully and generated `package-lock.json`.

Npm reported two high-severity audit findings in the dependency tree. `npm audit fix` was not run automatically because it can alter package versions and app behavior.

## Vite/TanStack Configuration

The Lovable Vite wrapper was replaced with explicit plugins:

- `@tanstack/react-start/plugin/vite`
- `@tanstack/router-plugin/vite`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `vite-tsconfig-paths`

The router plugin is configured without auto code splitting to match the existing generated route trees.
