# Architecture

## Folder Structure

```text
workspace/
  package.json
  package-lock.json
  tsconfig.json
  eslint.config.js
  components.json
  shared/
    components/ui/
    components/layout/
    components/theme/
    components/glass/
    components/command/
    components/providers/
    hooks/
    lib/
    animations/
    icons/
    assets/
    types/
  apps/
    formatx/
    passx/
    filex/
```

## Dependency Graph

The root package owns the dependency graph. Each app package is intentionally thin and only exposes scripts. Runtime dependencies are installed once at the workspace root and resolved by npm workspaces.

```text
root package.json
  -> shared/*
  -> apps/formatx
  -> apps/passx
  -> apps/filex
```

## Component Graph

```text
apps/*/src/routes
  -> app-owned components, stores, services, libs
  -> @shared/components/ui/*
  -> @shared/hooks/use-mobile
  -> @shared/lib/utils

shared/components/ui/*
  -> Radix primitives
  -> lucide-react
  -> class-variance-authority
  -> @shared/lib/utils
```

## Shared Component Map

- `shared/components/ui`: 46 identical shadcn/ui components lifted from the three apps.
- `shared/hooks/use-mobile.tsx`: identical responsive hook lifted from all apps.
- `shared/lib/utils.ts`: identical `cn` utility lifted from all apps.
- Reserved shared folders were created for future extraction of layout, theme, glass, command, provider, animation, icon, asset, and type primitives.

## App Separation

Business logic remains app-local:

- FormatX: formatting/highlighting logic in `apps/formatx/src/lib`, routes in `apps/formatx/src/routes`.
- PassX: password engine, Zustand store, theme/accent UI, and PassX components in `apps/passx/src`.
- FileX: conversion, orchestration, inspector, queue, PDF/image/video/archive logic, and FileX components in `apps/filex/src`.

## Removed Files

Removed Lovable/export artifacts:

- `.lovable/`
- `.workspace/`
- `AGENTS.md`
- `src/lib/lovable-error-reporting.ts`
- `src/lib/error-capture.ts`
- `src/lib/error-page.ts`
- app-local `bunfig.toml` files referencing Lovable packages
- duplicated app-local shadcn/ui directories
- duplicated app-local `use-mobile.tsx`
- duplicated app-local `utils.ts`

## Deduplicated Files

All duplicated shadcn/ui files were moved to `shared/components/ui`, and app imports were rewritten from `@/components/ui/*` to `@shared/components/ui/*`.

## Migration Strategy

1. Extract source ZIPs into an isolated staging area.
2. Copy apps into `workspace/apps/*` without Lovable export folders.
3. Lift byte-identical shared infrastructure into `workspace/shared`.
4. Replace Lovable Vite wrapper with normal Vite, TanStack Start, TanStack Router, React, Tailwind, and tsconfig-path plugins.
5. Merge dependency versions into one root `package.json`.
6. Preserve app routes and business logic in place.
7. Verify install, dev, typecheck, build, and lint.
