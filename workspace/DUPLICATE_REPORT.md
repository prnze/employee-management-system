# Duplicate Report

## Summary

The primary duplication across FormatX, PassX, and FileX was infrastructure-level code generated identically in each project. The migration removed those duplicates and routed all apps to shared implementations.

## Duplicated Files Moved To Shared

Moved from each app's `src/components/ui` into `shared/components/ui`:

- `accordion.tsx`
- `alert-dialog.tsx`
- `alert.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `badge.tsx`
- `breadcrumb.tsx`
- `button.tsx`
- `calendar.tsx`
- `card.tsx`
- `carousel.tsx`
- `chart.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input-otp.tsx`
- `input.tsx`
- `label.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `progress.tsx`
- `radio-group.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `toggle-group.tsx`
- `toggle.tsx`
- `tooltip.tsx`

## Duplicated Hooks

- `src/hooks/use-mobile.tsx` was identical in all three apps and now lives at `shared/hooks/use-mobile.tsx`.

## Duplicated Utilities

- `src/lib/utils.ts` was identical in all three apps and now lives at `shared/lib/utils.ts`.

## Duplicated Dependencies

The three app-level dependency graphs duplicated the same React, Vite, TanStack, Tailwind, shadcn/Radix, Framer Motion, Lucide, and utility packages. These now live once in the root `package.json`.

## Duplicated Configuration

The following config files were standardized at the root:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.js`
- `.prettierrc`
- `.prettierignore`
- `components.json`

Each app retains a small `vite.config.ts`, `tsconfig.json`, `components.json`, and package script wrapper where app-local context is required.

## Assets

No duplicated binary assets were found in the exported source trees beyond build/package metadata. App-specific visual and conversion assets remain in their owning apps.

## Command Palette

The generic shadcn `command.tsx` primitive is shared. App-specific command palette behavior remains app-local where it is tied to app actions.

## Themes And Animations

Theme and animation code in the exports is coupled to app-specific UI and CSS variables. Shared-ready folders were created, but app-specific theme/accent/glass behavior was not merged because it was not byte-identical and merging it would risk visual/functionality changes.
