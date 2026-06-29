# ShareX Design System v2.0 Migration

## What Changed

- Added a scoped ShareX theme engine with persisted dark/light mode and solid accent color selection.
- Replaced aurora backgrounds, gradients, neon glow, and ad hoc chip styles with neutral Apple-style glass tokens.
- Standardized spacing around the 4/8/12/16/20/24/32/40/48/64/80/96 scale.
- Standardized radii, button states, focus rings, scrollbars, form controls, metadata rows, cards, modals, and preview surfaces.
- Updated ShareX home, create, dashboard, about, share view, password screen, file dropzone, file list, content viewer, upload progress, file preview, and share result modal.

## Token Entry Points

- Theme service: `src/app/features/sharex/services/sharex-theme.service.ts`
- ShareX shell tokens and reusable component primitives: `src/app/features/sharex/layout/sharex-layout.component.scss`
- Global thin scrollbar normalization: `src/styles.scss`

## Migration Guidance

1. Prefer ShareX tokens over hard-coded colors: `--sx-bg`, `--sx-card`, `--sx-border`, `--sx-text`, `--sx-accent`, `--sx-accent-soft`, and `--sx-accent-border`.
2. Use existing ShareX button classes before adding new button styles: primary, secondary/ghost, danger, and icon actions are already tokenized.
3. For new cards and modals, use the existing glass pattern: subtle blur, thin border, internal highlight, and restrained shadow.
4. Keep new spacing to the defined scale. Avoid one-off values unless a browser constraint requires it.
5. Avoid gradients and glow effects in ShareX. Use one solid accent color and semantic state colors.
6. Respect `prefers-reduced-motion`; keep animations deliberate and scoped to feedback, transitions, and status changes.

## Verification

- `npm run build` passes.
- Screenshots are in `sharex-redesign-screenshots/`.
