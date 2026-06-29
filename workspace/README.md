# FormatX / PassX / FileX Workspace

This workspace consolidates the three React applications exported from Lovable into one npm workspace while preserving each app's routes, features, business logic, themes, and animations.

## Structure

```text
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

## Commands

```bash
npm install
npm run dev
npm run dev:formatx
npm run dev:passx
npm run dev:filex
npm run build
npm run lint
npm run typecheck
```

The default `npm run dev` starts FormatX. Use the app-specific scripts for PassX or FileX.

## Notes

- Shared shadcn/ui components live in `shared/components/ui`.
- Shared hook and utility imports use `@shared/...`.
- Application-specific routes, stores, services, conversion logic, and page components remain inside their app folders.
- Lovable telemetry/configuration artifacts were removed.
