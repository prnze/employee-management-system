# React Infrastructure Audit

Audit date: 2026-07-19

## Findings

| Artifact | Status | Angular reference | Cleanup decision |
| --- | --- | --- | --- |
| `workspace/` | React/Vite/TanStack workspace containing FormatX, PassX, FileX, shared shadcn UI, and its own npm workspace | None | Remove entire directory |
| `workspace/package.json` and lockfile | React, Vite, TanStack, Radix, Tailwind, shadcn tooling | None | Remove with workspace |
| `workspace/apps/` | Obsolete React application sources | None | Remove with workspace |
| `workspace/shared/` | Obsolete React shared components, hooks, assets, and types | None | Remove with workspace |
| Root `package-lock.json` workspace entries | Residual lockfile records for the deleted workspace | None | Regenerate with root `npm install` |
| `vercel.json` React rewrites | `/formatx`, `/passx`, and `/filex` rewrites target React static exports | None | Replace with one Angular SPA fallback rewrite |
| Root `.gitignore` Vite/VitePress patterns | Legacy generic Vite ignore entries | None | Remove patterns |
| PassX and FormatX migration analysis/reports | Historical documents that identify React/Vite workspace files as active reference applications | None | Remove obsolete migration-era reports |
| Root React verification logs | Local, ignored Vite verification output | None | Remove local artifacts |

## Kept Artifacts

- `src/app/**`, `angular.json`, root `package.json`, and Angular TypeScript configuration are Angular application infrastructure.
- `@app`, `@core`, `@shared`, `@features`, and `@layouts` are Angular path aliases and remain in use.
- `prismjs` is retained because Angular FormatX uses it for syntax highlighting.
- Angular 21's `@angular/build` has a transitive Vite dependency for Angular's own builder/dev-server implementation. It is not React infrastructure and must remain for `ng build` and `ng serve`.
- Current FormatX verification screenshots and Angular production reports remain Angular deliverables.

## Conclusion

No Angular feature imports, builds, or deploys from `workspace/`. Its removal, lockfile normalization, and Vercel rewrite replacement are safe and required for an Angular-only repository.
